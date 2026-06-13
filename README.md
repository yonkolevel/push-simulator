# Ableton Push 2 Simulator

A desktop Ableton Push 2 simulator built with [Wails](https://wails.io/) + Go + React/TypeScript.

The simulator creates Push-like virtual MIDI ports and renders an interactive Push 2 surface so external MIDI tools can be mapped and tested without the physical controller.

## Why use it

Use this when you want to:

- test Push 2-style note, CC, and pitch-bend input from a desktop app
- map controls in tools like MidiCircuit
- debug MIDI routing with visible sent/received event history
- verify channels, velocity, pad ranges, and common Push CC mappings
- recover quickly from stuck notes or controls while experimenting

## Quick start with MidiCircuit or another MIDI app

1. Start the simulator:

   ```bash
   wails dev
   ```

   Or build and run the desktop app:

   ```bash
   wails build
   ```

2. In your MIDI app, connect to either simulator port:

   - `Ableton Push 2 Live Port`
   - `Ableton Push 2 User Port`

3. Open the simulator **Performance Panel** and follow the **MidiCircuit Checklist**.

4. Use the probe controls to confirm routing:

   - **Test Note** — sends a configurable note with the current pad velocity.
   - **Test CC** — sends a configurable control-change pulse.
   - **Test Bend** — sends a pitch-bend value from `-8192` to `8191`.
   - **Pad Sweep** — walks the 8×8 pad range, notes `36–99`.
   - **CC Sweep** — walks common Push controls such as soft buttons, transport, nav, and mode buttons.

5. If anything sticks, click **Panic / Reset MIDI**. It sends:

   - note off for notes `0–127`
   - CC off for controllers `0–127`
   - all-notes-off CC `123`
   - centered pitch bend `0`

6. If routing still looks wrong, use **Copy Report** in MIDI Status. It includes port names, backend status, channel, selected control, active notes/controls, and recent MIDI events.

Before considering a release ready, run the manual checklist in [`docs/verification/midicircuit.md`](docs/verification/midicircuit.md) against the real MidiCircuit app.

## Useful MIDI map

Common Push 2 mappings exposed by the simulator:

| Area | Mapping |
| --- | --- |
| Pads | Notes `36–99` |
| Top soft buttons | CC `102–109` |
| Bottom soft buttons | CC `20–27` |
| Play / Record | CC `85` / `86` |
| Delete / Undo | CC `118` / `119` |
| Mute / Solo / Stop Clip | CC `60` / `61` / `29` |
| Device / Mix / Clip / Scale | CC `110` / `112` / `113` / `58` |
| Repeat / Accent | CC `56` / `57` |
| Arrows | CC `44–47` |
| Page / Octave | CC `62–63` / `54–55` |
| Touch strip | Pitch bend `-8192…8191` |

For exact control IDs while using the app, hover or focus a control and read the **Control inspector** in the Performance Panel. Use **Copy MIDI Map** to copy a plain-text map for notes, docs, or issues.

## Persistent simulator settings

The Performance Panel remembers these settings across reloads/restarts:

- pad velocity
- MIDI channel
- pad label visibility
- Test Note
- Test CC
- Test Bend

## Keyboard pad input

The keyboard maps to the lower half of the Push pad grid:

```text
1 2 3 4 5 6 7 8
Q W E R T Y U I
A S D F G H J K
Z X C V B N M ,
```

Hold `Shift` to latch multiple pads. Hold `Option` for chord mode.

## Development

The `frontend` folder contains the React app. Go backend packages live at the repository root and under `push/`.

### Live development

```bash
wails dev
```

Wails runs a Vite dev server with hot reload. The browser dev server is available at `http://localhost:34115` for calling Go methods from devtools.

### Production build

```bash
wails build
```

### Runtime MIDI smoke check

With the simulator running, verify that an external process can see the same ports MidiCircuit should see:

```bash
go run ./tools/check-midi-ports.go
```

Expected success output ends with:

```text
OK: Ableton Push 2 Live/User virtual ports are visible as both inputs and outputs.
```

To capture outgoing simulator events without another app, add `-listen` and then trigger pads/CCs/pitch bend in the simulator:

```bash
go run ./tools/check-midi-ports.go -listen -port "Ableton Push 2 Live Port" -seconds 15
```

To verify the simulator receives MIDI from an external process, add `-send` and check the simulator event history for received note, CC, and pitch-bend messages:

```bash
go run ./tools/check-midi-ports.go -send -port "Ableton Push 2 Live Port" -note 36 -velocity 100 -cc 85 -bend 1024 -channel 1
```

### Validation

```bash
go test ./push/...
cd frontend && npm test
cd frontend && npm run build
go run ./tools/check-midi-ports.go # with the simulator running
```

## Push 2 references

- [Push Display Interface](https://github.com/yonkolevel/push-simulator)
- [Push 2 User Manual](https://www.ableton.com/en/manual/using-push-2/)
