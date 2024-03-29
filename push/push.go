package push

import (
	"context"
	"time"

	"gitlab.com/gomidi/midi/writer"

	"encoding/hex"
	"log"

	"gitlab.com/gomidi/midi"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"gitlab.com/gomidi/midi/reader"
	driver "gitlab.com/gomidi/rtmididrv"
)

type Push interface {
	SendCCOn(controller uint8) error
	SendCC(controller uint8, value uint8) error
	SendCCOff(controller uint8) error
	SendNoteOn(note, velocity uint8) error
	SendNoteOff(note uint8) error
	SetUserMode() error
	SetLiveMode() error
	CloseSession() error
	SetScaleMode(mode ScaleMode)
	Startup(ctx context.Context)
	GetNotePads() NotePads
	Shutdown(ctx context.Context)
}

type AbletonPush struct {
	LivePortIn     midi.In
	LivePortOut    midi.Out
	UserPortIn     midi.In
	UserPortOut    midi.Out
	Driver         midi.Driver
	Reader         midi.Reader
	LivePortWriter writer.ChannelWriter
	UserPortWriter writer.ChannelWriter
	NotePads       NotePads
	ScaleMode      ScaleMode
	Mode           DeviceMode
	ActivePads     map[string]Note
	ctx            context.Context
}

func must(err error) {
	if err != nil {
		panic(err.Error())
	}
}

func (push *AbletonPush) CloseSession() error {
	return push.Driver.Close()
}

// New - returns a new instance of AbletonPush
func NewAbletonPush() Push {
	p := &AbletonPush{}
	p.NotePads = createNotePads()
	return p
}

func (ap *AbletonPush) Startup(ctx context.Context) {
	ap.ctx = ctx
	runtime.LogPrint(ctx, "STARTED")
	drv, err := driver.New()
	in, err := drv.OpenVirtualIn(DEVICE_NAME)
	must(err)
	out, err := drv.OpenVirtualOut(DEVICE_NAME)
	must(err)
	ap.Driver = drv
	must(in.Open())
	must(in.Open())

	uwr := writer.New(out)

	ap.LivePortWriter = uwr
	ap.UserPortWriter = uwr
	ap.LivePortIn = in
	ap.LivePortOut = out
	ap.UserPortIn = in
	ap.UserPortOut = out

	rd := reader.New(
		reader.NoLogger(),
		reader.Device(func(_ reader.Position, name string) {
			log.Println(name)
		}),
		reader.NoteOn(func(p *reader.Position, channel, key, velocity uint8) {
			runtime.LogDebugf(ctx, "note_on %d %d", key, velocity)
			runtime.EventsEmit(ap.ctx, "note_on", key, velocity)
		}),
		reader.NoteOff(func(p *reader.Position, channel, key, velocity uint8) {
			runtime.LogDebugf(ctx, "note_off %d", key)
			runtime.EventsEmit(ap.ctx, "note_off", key, velocity)
		}),
		reader.ControlChange(func(p *reader.Position, channel, controller, velocity uint8) {
			runtime.LogDebugf(ctx, "cc %d %d", controller, velocity)
			runtime.EventsEmit(ap.ctx, "cc", controller, velocity)
		}),
		reader.RTStart(func() {
			log.Println("Start msg")
			runtime.LogDebugf(ctx, "RTStart")
		}),
		reader.RTStop(func() {
			log.Println("Stop msg")
			runtime.LogDebugf(ctx, "RTStop")
		}),
		reader.SysEx(func(r *reader.Position, data []byte) {
			if testEq(data, deviceIdReq) {
				log.Println("Device id requested")

				msg := pushIdReply

				time.Sleep(time.Millisecond * 500)
				err = writer.SysEx(ap.LivePortWriter, msg)

				if err != nil {
					log.Println(err)
				}

				log.Println("Sent")
				log.Println(msg)
			}

			if testEq(data, deviceStatsReq) {
				log.Println("Device stats requested")
			}

			if testEq(data, SET_LIVE_MODE_MSG) {
				log.Println("Set live mode requested")

				err = writer.SysEx(ap.LivePortWriter, SET_LIVE_MODE_MSG)

				if err != nil {
					log.Println(err)
				}

				err = writer.SysEx(ap.UserPortWriter, SET_LIVE_MODE_MSG)

				if err != nil {
					log.Println(err)
				}
			}
		}),
	)

	ap.Reader = rd

	rd.ListenTo(in)

	// return nil
}

func (push *AbletonPush) Shutdown(ctx context.Context) {
	push.CloseSession()
}

func (ap *AbletonPush) SetScaleMode(mode ScaleMode) {
	ap.ScaleMode = mode
}

func (ap *AbletonPush) SetUserMode() error {
	err := writer.SysEx(ap.LivePortWriter, SET_USER_MODE_MSG)

	if err != nil {
		return err
	}

	ap.Mode = User

	return nil
}

func (ap *AbletonPush) SetLiveMode() error {
	err := writer.SysEx(ap.LivePortWriter, SET_LIVE_MODE_MSG)

	if err != nil {
		return err
	}

	ap.Mode = Live

	return nil
}

func (push *AbletonPush) activeSense(tick time.Duration) {
	ticker := time.NewTicker(tick)

	wr := writer.New(push.LivePortOut)

	done := make(chan bool)
	var ticks int = 0
	go func() {
		for {
			select {
			case <-ticker.C:
				ticks++
				writer.RTActivesense(wr)
			case <-done:
				ticker.Stop()
				return
			}
		}
	}()
}

func (ap *AbletonPush) GetNotePads() NotePads {
	return ap.NotePads
}

func testEq(a, b []byte) bool {

	// If one is nil, the other must also be nil.
	if (a == nil) != (b == nil) {
		return false
	}

	if len(a) != len(b) {
		return false
	}

	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}

	return true
}

func getDecodedHexString(src []byte) string {
	o := hex.EncodeToString(src)

	return o
}

func (ap *AbletonPush) PadDown(note Note) {
	key := padKey(note.note, note.octave)

	ap.ActivePads[key] = note

	if _, ok := ap.NotePads[key]; !ok {
		return
	}
}

func (ap *AbletonPush) PadUp(note Note) {
	key := padKey(note.note, note.octave)

	delete(ap.ActivePads, key)

	if _, ok := ap.NotePads[key]; ok {
		return
	}
}
