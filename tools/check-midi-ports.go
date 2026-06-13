package main

import (
	"flag"
	"fmt"
	"os"
	"strings"
	"time"

	"gitlab.com/gomidi/midi"
	"gitlab.com/gomidi/midi/reader"
	driver "gitlab.com/gomidi/rtmididrv"
)

var requiredPorts = []string{
	"Ableton Push 2 Live Port",
	"Ableton Push 2 User Port",
}

func main() {
	listen := flag.Bool("listen", false, "listen for MIDI messages from the selected simulator port after checking port visibility")
	portName := flag.String("port", "Ableton Push 2 Live Port", "port name or substring to listen to")
	listenSeconds := flag.Int("seconds", 15, "number of seconds to listen when -listen is set")
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

	if *listen {
		listenToPort(ins, *portName, time.Duration(*listenSeconds)*time.Second)
	}
}

func listenToPort(ins []midi.In, name string, duration time.Duration) {
	in := findPort(ins, name)
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

func findPort(ports []midi.In, name string) midi.In {
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

func fatal(err error) {
	fmt.Fprintln(os.Stderr, "error:", err)
	os.Exit(1)
}
