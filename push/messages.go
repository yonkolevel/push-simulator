package push

import (
	"gitlab.com/gomidi/midi/writer"
)

// SendNoteOn - Sends a MIDI note on message
func (p *AbletonPush) SendCCNoteOn(controller uint8) error {
	err := writer.CcOn(p.LivePortWriter, 60)
	return err
}

// SendNoteOn - Sends a MIDI note on message
func (p *AbletonPush) SendCC(controller, value uint8) error {
	err := writer.ControlChange(p.LivePortWriter, controller, value)
	return err
}

func (p *AbletonPush) SendNoteOn(note, velocity uint8) error {
	err := writer.NoteOn(p.LivePortWriter, note, velocity)
	return err
}

func (p *AbletonPush) SendNoteOff(note uint8) error {
	err := writer.NoteOff(p.LivePortWriter, note)
	return err
}

// SendNoteOff - Sends a MIDI note off message
func (p *AbletonPush) SendCCNoteOff(controller uint8) error {
	err := writer.CcOff(p.LivePortWriter, controller)
	return err
}

// SendPitchBend - Sends a MIDI note off message
func (p *AbletonPush) SendPitchBend(value int16) error {
	err := writer.Pitchbend(p.LivePortWriter, value)
	return err
}

// Start writes the start realtime message
func (p *AbletonPush) RTStart() error {
	wr := writer.New(p.LivePortOut)
	err := writer.RTStart(wr)
	return err
}

// Stop writes the start realtime message
func (p *AbletonPush) Stop() error {
	wr := writer.New(p.LivePortOut)
	err := writer.RTStop(wr)
	return err
}
