package push

import (
	"testing"

	"gitlab.com/gomidi/midi"
)

type fakeChannelWriter struct {
	channel uint8
	writes  [][]byte
}

func (w *fakeChannelWriter) Channel() uint8 {
	return w.channel
}

func (w *fakeChannelWriter) SetChannel(no uint8) {
	w.channel = no
}

func (w *fakeChannelWriter) Write(message midi.Message) error {
	w.writes = append(w.writes, append([]byte(nil), message.Raw()...))
	return nil
}

func TestNewAbletonPushInitializesNotePads(t *testing.T) {
	ap := NewAbletonPush()

	if ap.GetNotePads() == nil {
		t.Fatal("expected note pads to be initialized")
	}

	if len(ap.GetNotePads()) == 0 {
		t.Fatal("expected note pad map to contain pads")
	}
}

func TestPushPortNamesReflectAbletonEndpoints(t *testing.T) {
	if Push2LivePort != "Ableton Push 2 Live Port" {
		t.Fatalf("unexpected live port name: %s", Push2LivePort)
	}

	if Push2UserPort != "Ableton Push 2 User Port" {
		t.Fatalf("unexpected user port name: %s", Push2UserPort)
	}
}

func TestSetChannelValidatesHumanMidiRange(t *testing.T) {
	ap := &AbletonPush{}

	if err := ap.SetChannel(0); err == nil {
		t.Fatal("expected channel 0 to be rejected")
	}

	if err := ap.SetChannel(17); err == nil {
		t.Fatal("expected channel 17 to be rejected")
	}

	if err := ap.SetChannel(10); err != nil {
		t.Fatalf("expected channel 10 to be accepted: %v", err)
	}

	if got := ap.GetChannel(); got != 10 {
		t.Fatalf("expected channel 10, got %d", got)
	}
}

func TestGetMIDIStatusReportsConfiguration(t *testing.T) {
	ap := &AbletonPush{Mode: User, Channel: 3}
	status := ap.GetMIDIStatus()

	if status.Ready {
		t.Fatal("expected status to report not ready before startup")
	}
	if status.LivePort != Push2LivePort || status.UserPort != Push2UserPort {
		t.Fatalf("unexpected ports: %#v", status)
	}
	if status.Mode != User {
		t.Fatalf("expected user mode, got %s", status.Mode)
	}
	if status.Channel != 3 {
		t.Fatalf("expected channel 3, got %d", status.Channel)
	}
}

func TestSetChannelUpdatesBothLiveAndUserWriters(t *testing.T) {
	liveWriter := &fakeChannelWriter{}
	userWriter := &fakeChannelWriter{}
	ap := &AbletonPush{LivePortWriter: liveWriter, UserPortWriter: userWriter}

	if err := ap.SetChannel(9); err != nil {
		t.Fatalf("expected channel 9 to be accepted: %v", err)
	}

	if liveWriter.Channel() != 8 {
		t.Fatalf("expected live writer channel 8, got %d", liveWriter.Channel())
	}
	if userWriter.Channel() != 8 {
		t.Fatalf("expected user writer channel 8, got %d", userWriter.Channel())
	}
}

func TestActiveWriterUsesUserWriterOnlyInUserMode(t *testing.T) {
	liveWriter := &fakeChannelWriter{}
	userWriter := &fakeChannelWriter{}
	ap := &AbletonPush{LivePortWriter: liveWriter, UserPortWriter: userWriter}

	if got := ap.activeWriter(); got != liveWriter {
		t.Fatal("expected live writer by default")
	}

	ap.Mode = User
	if got := ap.activeWriter(); got != userWriter {
		t.Fatal("expected user writer in user mode")
	}
}
