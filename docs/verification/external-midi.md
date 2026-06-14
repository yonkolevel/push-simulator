# External MIDI app manual verification checklist

Use this checklist before marking the simulator usability goal complete. The app must be tested against the real external MIDI app UI, not only automated unit/build checks.

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

   Optional: send note, CC, and pitch-bend messages into the simulator from a separate process and confirm the simulator event history shows received messages.

   ```bash
   go run ./tools/check-midi-ports.go -send -port "Ableton Push 2 Live Port" -note 36 -velocity 100 -cc 85 -bend 1024 -channel 1
   ```

3. Open your external MIDI app and connect to one simulator port:

   - `Ableton Push 2 Live Port`
   - `Ableton Push 2 User Port`

## Required pass/fail checks

Record evidence for each row. Screenshots, copied MIDI event logs, copied debug reports, or the in-app **Copy Verification Report** output are all acceptable.

| Check | Expected result | Pass? | Evidence / notes |
| --- | --- | --- | --- |
| Port discovery | The external MIDI app shows `Ableton Push 2 Live Port` and/or `Ableton Push 2 User Port` as connectable MIDI devices. |  |  |
| External listener | `go run ./tools/check-midi-ports.go -listen ...` captures note, CC, and pitch-bend events from the simulator port. |  |  |
| External sender | `go run ./tools/check-midi-ports.go -send ...` sends note, CC, and pitch-bend into the simulator and the simulator event history shows received messages. |  |  |
| Test Note | Simulator **Test Note** arrives in the external MIDI app with the selected note, velocity, and channel. |  |  |
| Test CC | Simulator **Test CC** arrives in the external MIDI app with the selected controller and channel. |  |  |
| Test Bend | Simulator **Test Bend** arrives in the external MIDI app as pitch bend, including center value `0`. |  |  |
| Pad interaction | Clicking pads sends notes `36–99`; visual simulator history and the external MIDI app agree on note/channel/velocity. |  |  |
| Control interaction | Clicking common controls sends expected CCs; hover inspector, event history, and the external MIDI app agree. |  |  |
| Touch strip | Dragging the touch strip sends pitch bend and resets to center on release. |  |  |
| Pad Sweep | **Pad Sweep** can drive external app mapping across notes `36–99`; **Stop Sweep** cancels safely. |  |  |
| CC Sweep | **CC Sweep** can drive external app mapping for common Push controls; **Stop Sweep** cancels safely. |  |  |
| Panic / Reset MIDI | Panic releases stuck notes/controls in the external MIDI app and centers pitch bend. |  |  |
| Persistence | Restart/reload preserves pad velocity, MIDI channel, pad labels, Test Note, Test CC, and Test Bend. |  |  |
| Debug evidence | **Copy Report** includes ports, channel, selected control, active state, and recent events useful for troubleshooting. |  |  |
| Verification report | **Copy Verification Report** copies a checklist report seeded with ports, channel, selected control, active state, and recent events. |  |  |

## Local smoke evidence

These checks prove the simulator's virtual ports, emitted MIDI messages, and received MIDI messages are visible to another process. They do **not** replace the real external MIDI app checks above.

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

Inbound command:

```bash
go run ./tools/check-midi-ports.go -send -port "Ableton Push 2 Live Port" -note 36 -velocity 101 -cc 85 -bend 1024 -channel 2
```

Observed output:

```text
MIDI inputs:
- Ableton Push 2 Live Port
- Ableton Push 2 User Port
MIDI outputs:
- Ableton Push 2 Live Port
- Ableton Push 2 User Port
OK: Ableton Push 2 Live/User virtual ports are visible as both inputs and outputs.
Sending smoke sequence to "Ableton Push 2 Live Port" on channel 2.
OK: sent note=36 velocity=101 cc=85 bend=1024 channel=2.
```

Simulator UI evidence after inbound command:

```text
RECEIVED · NOTE ON 36 · VEL 101 · CH 2
RECEIVED · NOTE OFF 36 · VEL 0 · CH 2
RECEIVED · CC 85 · VEL 127 · CH 2
RECEIVED · CC 85 · VEL 0 · CH 2
RECEIVED · PITCH BEND · VALUE 1024 · CH 2
```

## Verification report template

Use **Copy Verification Report** in the simulator's MIDI Status panel to generate this with the current simulator snapshot and recent events pre-filled. If the simulator is unavailable, copy this block into the issue, PR, or release notes when running the real external MIDI app pass.

```markdown
# External MIDI verification report

Date/time:
Tester:
Simulator commit:
Simulator build/run mode: wails dev / wails build app
External MIDI app/version:
External MIDI platform: macOS / iOS simulator / iOS device
Connected port: Ableton Push 2 Live Port / Ableton Push 2 User Port

## Automated smoke checks

- [ ] Port visibility: `go run ./tools/check-midi-ports.go`
  Evidence:
- [ ] External listener: `go run ./tools/check-midi-ports.go -listen -port "Ableton Push 2 Live Port" -seconds 15`
  Evidence:
- [ ] External sender: `go run ./tools/check-midi-ports.go -send -port "Ableton Push 2 Live Port" -note 36 -velocity 100 -cc 85 -bend 1024 -channel 1`
  Evidence:

## Real external MIDI app checks

- [ ] Port discovery
  Evidence:
- [ ] Test Note
  Evidence:
- [ ] Test CC
  Evidence:
- [ ] Test Bend
  Evidence:
- [ ] Pad interaction
  Evidence:
- [ ] Control interaction
  Evidence:
- [ ] Touch strip
  Evidence:
- [ ] Pad Sweep + Stop Sweep
  Evidence:
- [ ] CC Sweep + Stop Sweep
  Evidence:
- [ ] Panic / Reset MIDI
  Evidence:
- [ ] Persistence after restart/reload
  Evidence:
- [ ] Copy Report produces useful diagnostics
  Evidence:
- [ ] Copy Verification Report includes current simulator snapshot and recent events
  Evidence:

## Verdict

Result: PASS / FAIL / PARTIAL
Open issues:
Accepted out-of-scope items:
```

## Completion rule

Only mark the active goal complete when every required check above passes against an external MIDI app, or when any remaining failures are explicitly accepted as out of scope.

## Known non-blocking validation output

- Go/`wails build` may emit an `rtmidi` C++ variable-length-array warning from the native dependency.
- `wails build` may emit a macOS linker deployment-target warning on newer macOS SDKs.

These warnings do not fail the build, but should be noted if they appear in release notes or verification evidence.
