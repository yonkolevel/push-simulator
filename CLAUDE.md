# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ableton Push 2 desktop simulator built with Wails - a Go backend with a React/TypeScript frontend rendered in a native webview.

## Development Commands

```bash
# Full-stack development with hot reload
wails dev

# Production build
wails build

# Go tests
go test ./push/...

# Frontend only (from frontend/ directory)
npm run dev      # Vite dev server
npm run build    # TypeScript + Vite build
```

## Architecture

### Backend (Go)
- `main.go` / `app.go` - Wails app entry and bindings
- `push/push.go` - Core AbletonPush struct: MIDI I/O, device modes (Live/User), scale modes
- `push/utils.go` - Musical logic: note pad creation, scale calculations, chord detection
- `push/consts.go` - MIDI constants, SysEx messages, control mappings
- `push/messages.go` - MIDI message functions (SendNoteOn, SendNoteOff, SendCC)

Uses gomidi for MIDI protocol and rtmididrv for virtual MIDI ports ("Ableton Push 2 Live Port" / "User Port").

### Frontend (React/TypeScript)
- `frontend/src/libs/push2/context/PushContext.tsx` - State management via Context + useReducer (tracks pressed notes/controls, tap modes)
- `frontend/src/libs/push2/controls.ts` - ControlId enum mapping all 100+ Push controls
- `frontend/src/components/Push/Control.tsx` - Reusable control wrapper handling mouse events and visual feedback
- `frontend/src/components/Push/components/AbletonPush2.tsx` - Main SVG assembly of all Push 2 controls

UI is SVG-based with Chakra UI components. Uses React Spring and Framer Motion for animations.

### Communication
- **Frontend → Backend**: React calls Go functions via auto-generated Wails bindings in `frontend/wailsjs/go/`
- **Backend → Frontend**: Go emits events (`note_on`, `note_off`, `cc`) via `runtime.EventsEmit()`, listened to in PushContext via `EventsOn`

## Control Mapping
- 64 pads: MIDI notes 36-99 (8x8 grid)
- Soft buttons: CC 20-27 (top row SB1-SB8), CC 102-109 (bottom row SB9-SB16)
- All controls defined in `frontend/src/libs/push2/controls.ts`
