package push

// MIDIStatus reports the simulator's backend MIDI configuration for UI diagnostics.
type MIDIStatus struct {
	Ready    bool       `json:"ready"`
	LivePort string     `json:"livePort"`
	UserPort string     `json:"userPort"`
	Mode     DeviceMode `json:"mode"`
	Channel  uint8      `json:"channel"`
}

func (ap *AbletonPush) GetMIDIStatus() MIDIStatus {
	ready := ap.Driver != nil && ap.LivePortIn != nil && ap.LivePortOut != nil && ap.UserPortIn != nil && ap.UserPortOut != nil

	return MIDIStatus{
		Ready:    ready,
		LivePort: Push2LivePort,
		UserPort: Push2UserPort,
		Mode:     ap.Mode,
		Channel:  ap.GetChannel(),
	}
}
