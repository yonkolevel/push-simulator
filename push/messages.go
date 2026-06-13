package push

import (
	"fmt"

	"gitlab.com/gomidi/midi/writer"
)

func (p *AbletonPush) activeWriter() (writer.ChannelWriter, error) {
	if p.Mode == User {
		if p.UserPortWriter == nil {
			return nil, fmt.Errorf("MIDI writer is not ready: %s is unavailable", Push2UserPort)
		}
		return p.UserPortWriter, nil
	}

	if p.LivePortWriter == nil {
		return nil, fmt.Errorf("MIDI writer is not ready: %s is unavailable", Push2LivePort)
	}
	return p.LivePortWriter, nil
}

func (p *AbletonPush) liveWriter() (writer.ChannelWriter, error) {
	if p.LivePortWriter == nil {
		return nil, fmt.Errorf("MIDI writer is not ready: %s is unavailable", Push2LivePort)
	}
	return p.LivePortWriter, nil
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
	wr, err := p.activeWriter()
	if err != nil {
		return err
	}
	return writer.CcOn(wr, controller)
}

// SendCC sends a MIDI CC message.
func (p *AbletonPush) SendCC(controller, value uint8) error {
	wr, err := p.activeWriter()
	if err != nil {
		return err
	}
	return writer.ControlChange(wr, controller, value)
}

// SendNoteOn sends a MIDI note-on message.
func (p *AbletonPush) SendNoteOn(note, velocity uint8) error {
	wr, err := p.activeWriter()
	if err != nil {
		return err
	}
	return writer.NoteOn(wr, note, velocity)
}

// SendNoteOff sends a MIDI note-off message.
func (p *AbletonPush) SendNoteOff(note uint8) error {
	wr, err := p.activeWriter()
	if err != nil {
		return err
	}
	return writer.NoteOff(wr, note)
}

// SendCCOff sends a MIDI CC off message.
func (p *AbletonPush) SendCCOff(controller uint8) error {
	wr, err := p.activeWriter()
	if err != nil {
		return err
	}
	return writer.CcOff(wr, controller)
}

// SendPitchBend sends a pitch-bend message.
func (p *AbletonPush) SendPitchBend(value int16) error {
	wr, err := p.activeWriter()
	if err != nil {
		return err
	}
	return writer.Pitchbend(wr, value)
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
