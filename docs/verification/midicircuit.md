# MidiCircuit manual verification checklist

Use this checklist before marking the simulator usability goal complete. The app must be tested against the real MidiCircuit UI, not only automated unit/build checks.

## Setup

1. Build or run the simulator.

   ```bash
   wails build
   open build/bin/push-simulator-2023.app
   ```

   Or use live development:

   ```bash
   wails dev
   ```

2. Confirm virtual ports are visible from outside the simulator.

   ```bash
   go run ./tools/check-midi-ports.go
   ```

   Optional: capture outgoing simulator messages from a separate process while pressing pads, controls, or the touch strip.

   ```bash
   go run ./tools/check-midi-ports.go -listen -port "Ableton Push 2 Live Port" -seconds 15
   ```

3. Open MidiCircuit and connect to one simulator port:

   - `Ableton Push 2 Live Port`
   - `Ableton Push 2 User Port`

## Required pass/fail checks

Record evidence for each row. Screenshots, copied MIDI event logs, or copied debug reports are all acceptable.

| Check | Expected result | Pass? | Evidence / notes |
| --- | --- | --- | --- |
| Port discovery | MidiCircuit shows `Ableton Push 2 Live Port` and/or `Ableton Push 2 User Port` as connectable MIDI devices. |  |  |
| External listener | `go run ./tools/check-midi-ports.go -listen ...` captures note, CC, and pitch-bend events from the simulator port. |  |  |
| Test Note | Simulator **Test Note** arrives in MidiCircuit with the selected note, velocity, and channel. |  |  |
| Test CC | Simulator **Test CC** arrives in MidiCircuit with the selected controller and channel. |  |  |
| Test Bend | Simulator **Test Bend** arrives in MidiCircuit as pitch bend, including center value `0`. |  |  |
| Pad interaction | Clicking pads sends notes `36–99`; visual simulator history and MidiCircuit agree on note/channel/velocity. |  |  |
| Control interaction | Clicking common controls sends expected CCs; hover inspector, event history, and MidiCircuit agree. |  |  |
| Touch strip | Dragging the touch strip sends pitch bend and resets to center on release. |  |  |
| Pad Sweep | **Pad Sweep** can drive MidiCircuit mapping across notes `36–99`; **Stop Sweep** cancels safely. |  |  |
| CC Sweep | **CC Sweep** can drive MidiCircuit mapping for common Push controls; **Stop Sweep** cancels safely. |  |  |
| Panic / Reset MIDI | Panic releases stuck notes/controls in MidiCircuit and centers pitch bend. |  |  |
| Persistence | Restart/reload preserves pad velocity, MIDI channel, pad labels, Test Note, Test CC, and Test Bend. |  |  |
| Debug evidence | **Copy Report** includes ports, channel, selected control, active state, and recent events useful for troubleshooting. |  |  |

## Local smoke evidence

These checks prove the simulator's virtual ports and emitted MIDI messages are visible to another process. They do **not** replace the real MidiCircuit checks above.

Last local smoke run: `2026-06-14 01:04:33 JST`

Command:

```bash
go run ./tools/check-midi-ports.go -listen -port "Ableton Push 2 Live Port" -seconds 8
```

Simulator actions during listener window:

- `Send Note 0`
- `Send CC 0`
- `Send Bend`

Observed output:

```text
MIDI inputs:
- Ableton Push 2 Live Port
- Ableton Push 2 User Port
MIDI outputs:
- Ableton Push 2 Live Port
- Ableton Push 2 User Port
OK: Ableton Push 2 Live/User virtual ports are visible as both inputs and outputs.
Listening to "Ableton Push 2 Live Port" for 8s. Trigger pads, CCs, or pitch bend in the simulator now.
IN note_on note=0 velocity=100 channel=1
IN note_off note=0 velocity=0 channel=1
IN cc controller=0 value=127 channel=1
IN cc controller=0 value=0 channel=1
IN pitch_bend value=0 channel=1
Done listening.
```

## Completion rule

Only mark the active goal complete when every required check above passes against MidiCircuit, or when any remaining failures are explicitly accepted as out of scope.

## Known non-blocking validation output

- Go/`wails build` may emit an `rtmidi` C++ variable-length-array warning from the native dependency.
- `wails build` may emit a macOS linker deployment-target warning on newer macOS SDKs.

These warnings do not fail the build, but should be noted if they appear in release notes or verification evidence.
