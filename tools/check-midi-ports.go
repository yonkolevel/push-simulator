package main

import (
	"flag"
	"fmt"
	"os"
	"strings"
	"time"

	"gitlab.com/gomidi/midi"
	"gitlab.com/gomidi/midi/reader"
	"gitlab.com/gomidi/midi/writer"
	driver "gitlab.com/gomidi/rtmididrv"
)

var requiredPorts = []string{
	"Ableton Push 2 Live Port",
	"Ableton Push 2 User Port",
}

func main() {
	listen := flag.Bool("listen", false, "listen for MIDI messages from the selected simulator port after checking port visibility")
	send := flag.Bool("send", false, "send a note, CC, and pitch-bend smoke sequence into the selected simulator port after checking port visibility")
	portName := flag.String("port", "Ableton Push 2 Live Port", "port name or substring to listen to or send into")
	listenSeconds := flag.Int("seconds", 15, "number of seconds to listen when -listen is set")
	channel := flag.Uint("channel", 1, "human MIDI channel 1-16 for -send")
	note := flag.Uint("note", 36, "note number 0-127 for -send")
	velocity := flag.Uint("velocity", 100, "note velocity 1-127 for -send")
	cc := flag.Uint("cc", 85, "CC controller 0-127 for -send")
	bend := flag.Int("bend", 1024, "pitch bend value -8192..8191 for -send")
	flag.Parse()

	drv, err := driver.New()
	if err != nil {
		fatal(err)
	}
	defer drv.Close()

	ins, err := drv.Ins()
	if err != nil {
		fatal(err)
	}
	outs, err := drv.Outs()
	if err != nil {
		fatal(err)
	}

	fmt.Println("MIDI inputs:")
	for _, in := range ins {
		fmt.Printf("- %s\n", in.String())
	}

	fmt.Println("MIDI outputs:")
	for _, out := range outs {
		fmt.Printf("- %s\n", out.String())
	}

	for _, name := range requiredPorts {
		inFound := containsPort(ins, name)
		outFound := containsPort(outs, name)
		if !inFound || !outFound {
			fatal(fmt.Errorf("missing %q (input=%v output=%v); start the simulator first", name, inFound, outFound))
		}
	}

	fmt.Println("OK: Ableton Push 2 Live/User virtual ports are visible as both inputs and outputs.")

	if *send {
		sendSmokeSequence(outs, *portName, uint8InRange("channel", *channel, 1, 16)-1, uint8InRange("note", *note, 0, 127), uint8InRange("velocity", *velocity, 1, 127), uint8InRange("cc", *cc, 0, 127), int16InRange("bend", *bend, -8192, 8191))
	}

	if *listen {
		listenToPort(ins, *portName, time.Duration(*listenSeconds)*time.Second)
	}
}

func sendSmokeSequence(outs []midi.Out, name string, channel, note, velocity, cc uint8, bend int16) {
	out := findOutPort(outs, name)
	if out == nil {
		fatal(fmt.Errorf("could not find output port containing %q", name))
	}

	if err := out.Open(); err != nil {
		fatal(err)
	}
	defer out.Close()

	wr := writer.New(out)
	wr.SetChannel(channel)

	fmt.Printf("Sending smoke sequence to %q on channel %d.\n", out.String(), channel+1)
	mustWrite("note_on", writer.NoteOn(wr, note, velocity))
	time.Sleep(120 * time.Millisecond)
	mustWrite("note_off", writer.NoteOff(wr, note))
	time.Sleep(120 * time.Millisecond)
	mustWrite("cc_on", writer.ControlChange(wr, cc, 127))
	time.Sleep(120 * time.Millisecond)
	mustWrite("cc_off", writer.ControlChange(wr, cc, 0))
	time.Sleep(120 * time.Millisecond)
	mustWrite("pitch_bend", writer.Pitchbend(wr, bend))
	fmt.Printf("OK: sent note=%d velocity=%d cc=%d bend=%d channel=%d.\n", note, velocity, cc, bend, channel+1)
}

func listenToPort(ins []midi.In, name string, duration time.Duration) {
	in := findInPort(ins, name)
	if in == nil {
		fatal(fmt.Errorf("could not find input port containing %q", name))
	}

	if err := in.Open(); err != nil {
		fatal(err)
	}
	defer in.Close()

	fmt.Printf("Listening to %q for %s. Trigger pads, CCs, or pitch bend in the simulator now.\n", in.String(), duration)

	rd := reader.New(
		reader.NoLogger(),
		reader.NoteOn(func(_ *reader.Position, channel, note, velocity uint8) {
			fmt.Printf("IN note_on note=%d velocity=%d channel=%d\n", note, velocity, channel+1)
		}),
		reader.NoteOff(func(_ *reader.Position, channel, note, velocity uint8) {
			fmt.Printf("IN note_off note=%d velocity=%d channel=%d\n", note, velocity, channel+1)
		}),
		reader.ControlChange(func(_ *reader.Position, channel, controller, value uint8) {
			fmt.Printf("IN cc controller=%d value=%d channel=%d\n", controller, value, channel+1)
		}),
		reader.Pitchbend(func(_ *reader.Position, channel uint8, value int16) {
			fmt.Printf("IN pitch_bend value=%d channel=%d\n", value, channel+1)
		}),
	)

	if err := rd.ListenTo(in); err != nil {
		fatal(err)
	}

	time.Sleep(duration)
	fmt.Println("Done listening.")
}

func findInPort(ports []midi.In, name string) midi.In {
	for _, port := range ports {
		if strings.Contains(port.String(), name) {
			return port
		}
	}
	return nil
}

func findOutPort(ports []midi.Out, name string) midi.Out {
	for _, port := range ports {
		if strings.Contains(port.String(), name) {
			return port
		}
	}
	return nil
}

func containsPort[T fmt.Stringer](ports []T, name string) bool {
	for _, port := range ports {
		if strings.Contains(port.String(), name) {
			return true
		}
	}
	return false
}

func uint8InRange(name string, value uint, min, max uint) uint8 {
	if value < min || value > max {
		fatal(fmt.Errorf("%s must be between %d and %d, got %d", name, min, max, value))
	}
	return uint8(value)
}

func int16InRange(name string, value int, min, max int) int16 {
	if value < min || value > max {
		fatal(fmt.Errorf("%s must be between %d and %d, got %d", name, min, max, value))
	}
	return int16(value)
}

func mustWrite(label string, err error) {
	if err != nil {
		fatal(fmt.Errorf("could not send %s: %w", label, err))
	}
}

func fatal(err error) {
	fmt.Fprintln(os.Stderr, "error:", err)
	os.Exit(1)
}
