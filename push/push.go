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
	SetChannel(channel uint8) error
	GetChannel() uint8
	GetMIDIStatus() MIDIStatus
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
	Channel        uint8
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
	must(err)

	liveIn, err := drv.OpenVirtualIn(Push2LivePort)
	must(err)
	liveOut, err := drv.OpenVirtualOut(Push2LivePort)
	must(err)
	userIn, err := drv.OpenVirtualIn(Push2UserPort)
	must(err)
	userOut, err := drv.OpenVirtualOut(Push2UserPort)
	must(err)

	ap.Driver = drv
	ap.LivePortWriter = writer.New(liveOut)
	ap.UserPortWriter = writer.New(userOut)
	ap.LivePortIn = liveIn
	ap.LivePortOut = liveOut
	ap.UserPortIn = userIn
	ap.UserPortOut = userOut
	ap.Mode = Live
	ap.Channel = 1

	runtime.LogInfof(ctx, "MIDI ports ready: %s, %s", Push2LivePort, Push2UserPort)

	liveReader := ap.newMIDIReader(ctx)
	userReader := ap.newMIDIReader(ctx)
	ap.Reader = liveReader

	must(liveReader.ListenTo(liveIn))
	must(userReader.ListenTo(userIn))
}

func (ap *AbletonPush) newMIDIReader(ctx context.Context) *reader.Reader {
	return reader.New(
		reader.NoLogger(),
		reader.Device(func(_ reader.Position, name string) {
			log.Println(name)
		}),
		reader.NoteOn(func(p *reader.Position, channel, key, velocity uint8) {
			runtime.LogDebugf(ctx, "note_on %d %d ch %d", key, velocity, channel+1)
			runtime.EventsEmit(ap.ctx, "note_on", key, velocity, channel)
		}),
		reader.NoteOff(func(p *reader.Position, channel, key, velocity uint8) {
			runtime.LogDebugf(ctx, "note_off %d ch %d", key, channel+1)
			runtime.EventsEmit(ap.ctx, "note_off", key, velocity, channel)
		}),
		reader.ControlChange(func(p *reader.Position, channel, controller, velocity uint8) {
			runtime.LogDebugf(ctx, "cc %d %d ch %d", controller, velocity, channel+1)
			runtime.EventsEmit(ap.ctx, "cc", controller, velocity, channel)
		}),
		reader.Pitchbend(func(p *reader.Position, channel uint8, value int16) {
			runtime.LogDebugf(ctx, "pitch_bend %d ch %d", value, channel+1)
			runtime.EventsEmit(ap.ctx, "pitch_bend", value, channel)
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

				time.Sleep(time.Millisecond * 500)
				if err := writer.SysEx(ap.LivePortWriter, pushIdReply); err != nil {
					log.Println(err)
				}
			}

			if testEq(data, deviceStatsReq) {
				log.Println("Device stats requested")
			}

			if testEq(data, SET_LIVE_MODE_MSG) {
				log.Println("Set live mode requested")
				if err := writer.SysEx(ap.LivePortWriter, SET_LIVE_MODE_MSG); err != nil {
					log.Println(err)
				}
				if err := writer.SysEx(ap.UserPortWriter, SET_LIVE_MODE_MSG); err != nil {
					log.Println(err)
				}
			}
		}),
	)
}

func (push *AbletonPush) Shutdown(ctx context.Context) {
	push.CloseSession()
}

func (ap *AbletonPush) SetScaleMode(mode ScaleMode) {
	ap.ScaleMode = mode
}

func (ap *AbletonPush) SetUserMode() error {
	wr, err := ap.liveWriter()
	if err != nil {
		return err
	}

	if err := writer.SysEx(wr, SET_USER_MODE_MSG); err != nil {
		return err
	}

	ap.Mode = User

	return nil
}

func (ap *AbletonPush) SetLiveMode() error {
	wr, err := ap.liveWriter()
	if err != nil {
		return err
	}

	if err := writer.SysEx(wr, SET_LIVE_MODE_MSG); err != nil {
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
