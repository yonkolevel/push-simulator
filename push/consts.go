package push

import "gitlab.com/gomidi/midi/reader"

type noteEventFunc func(p *reader.Position, channel, key, vel uint8)
type sysexEventFunc func(p *reader.Position, data []byte)

type NotesState map[uint8]uint8

var IAC_DRIVER = "IAC Driver Live Port"

var Push2LivePort = "Ableton Push 2 Live Port"
var Push2UserPort = "Ableton Push 2 Live Port"

var pushIdReply = []byte{0x7E, 0x01, 0x06, 0x02, 0x00, 0x21, 0x1D, 0x67, 0x32, 0x02, 0x00, 0x01, 0x00, 0x47, 0x00, 0x7E, 0x1C, 0x3B, 0x08, 0x00, 0x01}
var deviceStatsReq = []byte{0x00, 0x21, 0x1D, 0x01, 0x01, 0x1A}
var deviceIdReq = []byte{0x7E, 0x7F, 0x06, 0x01}

var padSensitivityReq = []byte{0x00, 0x21, 0x1D, 0x01, 0x01, 0x28, 0x00, 0x00, 0x01}
var requestIdentityMsg = []byte{0xF0, 0x7E, 0x01, 0x06, 0x01, 0xF7}

var SET_LIVE_MODE_MSG = []byte{0x00, 0x21, 0x1D, 0x01, 01, 0x0A, 0x00}
var SET_USER_MODE_MSG = []byte{1, 1, 10, 1}

type ScaleMode string

const (
	InKey     ScaleMode = "in_key"
	Chromatic ScaleMode = "chromatic"
)

type DeviceMode string

const (
	Live DeviceMode = "live"
	User DeviceMode = "user"
)
