package push

import (
	"fmt"

	"gitlab.com/gomidi/midi/writer"
)

func (p *AbletonPush) activeWriter() writer.ChannelWriter {
	if p.Mode == User && p.UserPortWriter != nil {
		return p.UserPortWriter
	}

	return p.LivePortWriter
}

// SetChannel selects the outgoing MIDI channel, using the human-facing 1-16 range.
func (p *AbletonPush) SetChannel(channel uint8) error {
	if channel < 1 || channel > 16 {
		return fmt.Errorf("MIDI channel must be between 1 and 16, got %d", channel)
	}

	p.Channel = channel
	writerChannel := channel - 1
	if p.LivePortWriter != nil {
		p.LivePortWriter.SetChannel(writerChannel)
	}
	if p.UserPortWriter != nil {
		p.UserPortWriter.SetChannel(writerChannel)
	}
	return nil
}

// GetChannel returns the selected outgoing MIDI channel in the human-facing 1-16 range.
func (p *AbletonPush) GetChannel() uint8 {
	if p.Channel == 0 {
		return 1
	}
	return p.Channel
}

// SendCCOn sends a MIDI CC on message.
func (p *AbletonPush) SendCCOn(controller uint8) error {
	return writer.CcOn(p.activeWriter(), controller)
}

// SendCC sends a MIDI CC message.
func (p *AbletonPush) SendCC(controller, value uint8) error {
	return writer.ControlChange(p.activeWriter(), controller, value)
}

// SendNoteOn sends a MIDI note-on message.
func (p *AbletonPush) SendNoteOn(note, velocity uint8) error {
	return writer.NoteOn(p.activeWriter(), note, velocity)
}

// SendNoteOff sends a MIDI note-off message.
func (p *AbletonPush) SendNoteOff(note uint8) error {
	return writer.NoteOff(p.activeWriter(), note)
}

// SendCCOff sends a MIDI CC off message.
func (p *AbletonPush) SendCCOff(controller uint8) error {
	return writer.CcOff(p.activeWriter(), controller)
}

// SendPitchBend sends a pitch-bend message.
func (p *AbletonPush) SendPitchBend(value int16) error {
	return writer.Pitchbend(p.activeWriter(), value)
}

// RTStart writes the start realtime message.
func (p *AbletonPush) RTStart() error {
	wr := writer.New(p.LivePortOut)
	return writer.RTStart(wr)
}

// Stop writes the stop realtime message.
func (p *AbletonPush) Stop() error {
	wr := writer.New(p.LivePortOut)
	return writer.RTStop(wr)
}
