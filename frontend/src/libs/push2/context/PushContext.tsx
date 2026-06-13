import React, { createContext, useReducer, useRef } from 'react';
import { ControlId, ControlType } from '../controls';
import {
  SendCC,
  SendCCOn,
  SendCCOff,
  SendNoteOff,
  SendNoteOn,
  SendPitchBend,
  SetChannel,
} from '../../../../wailsjs/go/push/AbletonPush';
import { EventsOff, EventsOn } from '../../../../wailsjs/runtime/runtime';
import { Mode } from '../core';

// Keyboard to pad mapping (4 rows of 8 keys = 32 pads)
// Maps to bottom 4 rows of the Push 2 pad grid.
const keyToPadMap: Record<string, number> = {
  // Row 1 (bottom): Z X C V B N M , → Pads 36-43
  z: 36,
  x: 37,
  c: 38,
  v: 39,
  b: 40,
  n: 41,
  m: 42,
  ',': 43,
  // Row 2: A S D F G H J K → Pads 44-51
  a: 44,
  s: 45,
  d: 46,
  f: 47,
  g: 48,
  h: 49,
  j: 50,
  k: 51,
  // Row 3: Q W E R T Y U I → Pads 52-59
  q: 52,
  w: 53,
  e: 54,
  r: 55,
  t: 56,
  y: 57,
  u: 58,
  i: 59,
  // Row 4 (top): 1 2 3 4 5 6 7 8 → Pads 60-67
  '1': 60,
  '2': 61,
  '3': 62,
  '4': 63,
  '5': 64,
  '6': 65,
  '7': 66,
  '8': 67,
};

export type MidiEventSummary = {
  direction: 'sent' | 'received';
  type: 'note_on' | 'note_off' | 'cc' | 'pitch_bend';
  id: number;
  velocity?: number;
  value?: number;
  timestamp: number;
  channel?: number;
};

export type SelectedControl = {
  name: string;
  type: ControlType;
  id: ControlId;
};

export type MidiErrorSummary = {
  label: string;
  message: string;
  timestamp: number;
};

enum ActionType {
  PAD_DOWN,
  PAD_UP,
  CHANGE_TAP_MODE,
  RESET_TAP_MODE,
  NOTE_ON,
  NOTE_OFF,
  CONTROL_CHANGE,
  PANIC_ALL_OFF,
  SELECT_CONTROL,
  SET_PAD_VELOCITY,
  SET_MIDI_CHANNEL,
  SET_SHOW_PAD_LABELS,
  CLEAR_MIDI_EVENTS,
  MIDI_ERROR,
  PITCH_BEND,
}

type Action =
  | { type: ActionType.PAD_DOWN; payload: { id: ControlId; type?: ControlType; velocity?: number } }
  | { type: ActionType.PAD_UP; payload: { id: ControlId; type?: ControlType } }
  | { type: ActionType.CHANGE_TAP_MODE; payload: { mode: Mode } }
  | { type: ActionType.RESET_TAP_MODE }
  | { type: ActionType.NOTE_ON; payload: { id: ControlId; velocity: number; channel?: number } }
  | { type: ActionType.NOTE_OFF; payload: { id: ControlId; channel?: number } }
  | { type: ActionType.CONTROL_CHANGE; payload: { id: ControlId; velocity: number; channel?: number } }
  | { type: ActionType.PANIC_ALL_OFF }
  | { type: ActionType.SELECT_CONTROL; payload: SelectedControl }
  | { type: ActionType.SET_PAD_VELOCITY; payload: { velocity: number } }
  | { type: ActionType.SET_MIDI_CHANNEL; payload: { channel: number } }
  | { type: ActionType.SET_SHOW_PAD_LABELS; payload: { show: boolean } }
  | { type: ActionType.CLEAR_MIDI_EVENTS }
  | { type: ActionType.MIDI_ERROR; payload: MidiErrorSummary }
  | { type: ActionType.PITCH_BEND; payload: { direction: 'sent' | 'received'; value: number; channel?: number } };

type ControlState = {
  id: ControlId;
  type: ControlType;
  velocity: number;
};

export type AppState = {
  notesPressed: Set<ControlId>;
  controlsPressed: Set<ControlId>;
  noteState: Map<ControlId, ControlState>;
  controlsState: Map<ControlId, ControlState>;
  tapMode: Mode;
  lastMidiEvent?: MidiEventSummary;
  midiEvents: MidiEventSummary[];
  selectedControl?: SelectedControl;
  lastMidiError?: MidiErrorSummary;
  padVelocity: number;
  midiChannel: number;
  showPadLabels: boolean;
};

type Dispatch = (action: Action) => void;
type HeldMidiState = Pick<AppState, 'notesPressed' | 'controlsPressed'>;
type AppProviderProps = { children: React.ReactNode };
const AppStateContext = createContext<AppState | undefined>(undefined);

const AppDispatchContext = React.createContext<Dispatch | undefined>(undefined);

const readStoredNumber = (key: string, fallback: number, min: number, max: number) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  const parsed = raw === null ? NaN : Number(raw);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, Math.round(parsed)));
};

const readStoredBoolean = (key: string, fallback: boolean) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (raw === null) {
    return fallback;
  }

  return raw === 'true';
};

const writeStoredValue = (key: string, value: string | number | boolean) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, String(value));
  }
};

const STORAGE_KEYS = {
  padVelocity: 'push-simulator.padVelocity',
  midiChannel: 'push-simulator.midiChannel',
  showPadLabels: 'push-simulator.showPadLabels',
};

const initialState: AppState = {
  notesPressed: new Set(),
  controlsPressed: new Set(),
  controlsState: new Map(),
  noteState: new Map(),
  tapMode: Mode.Idle,
  midiEvents: [],
  padVelocity: readStoredNumber(STORAGE_KEYS.padVelocity, 100, 1, 127),
  midiChannel: readStoredNumber(STORAGE_KEYS.midiChannel, 1, 1, 16),
  showPadLabels: readStoredBoolean(STORAGE_KEYS.showPadLabels, false),
};

const MAX_MIDI_EVENTS = 256;

const withMidiEvent = (
  state: AppState,
  event: MidiEventSummary
): Pick<AppState, 'lastMidiEvent' | 'midiEvents'> => ({
  lastMidiEvent: event,
  midiEvents: [event, ...state.midiEvents].slice(0, MAX_MIDI_EVENTS),
});

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case ActionType.PAD_DOWN: {
      const { id, type = ControlType.NOTE } = action.payload;
      const velocity = action.payload.velocity ?? state.padVelocity;

      if (type === ControlType.CC) {
        return {
          ...state,
          controlsPressed: new Set(state.controlsPressed).add(id),
          ...withMidiEvent(state, {
            direction: 'sent',
            type: 'cc',
            id,
            velocity: 127,
            timestamp: Date.now(),
            channel: state.midiChannel,
          }),
        };
      }

      return {
        ...state,
        notesPressed: new Set(state.notesPressed).add(id),
        ...withMidiEvent(state, {
          direction: 'sent',
          type: 'note_on',
          id,
          velocity,
          timestamp: Date.now(),
          channel: state.midiChannel,
        }),
      };
    }

    case ActionType.PAD_UP: {
      if (state.tapMode === Mode.MultiTap) {
        return state;
      }

      const { id, type = ControlType.NOTE } = action.payload;

      if (type === ControlType.CC) {
        const controlsPressed = new Set(state.controlsPressed);
        controlsPressed.delete(id);
        return {
          ...state,
          controlsPressed,
          ...withMidiEvent(state, {
            direction: 'sent',
            type: 'cc',
            id,
            velocity: 0,
            timestamp: Date.now(),
            channel: state.midiChannel,
          }),
        };
      }

      const notesPressed = new Set(state.notesPressed);
      notesPressed.delete(id);
      return {
        ...state,
        notesPressed,
        ...withMidiEvent(state, {
          direction: 'sent',
          type: 'note_off',
          id,
          velocity: 0,
          timestamp: Date.now(),
          channel: state.midiChannel,
        }),
      };
    }

    case ActionType.CHANGE_TAP_MODE: {
      return {
        ...state,
        tapMode: action.payload.mode,
      };
    }

    case ActionType.RESET_TAP_MODE: {
      return {
        ...state,
        tapMode: Mode.Idle,
        notesPressed: new Set(),
        controlsPressed: new Set(),
      };
    }

    case ActionType.NOTE_ON: {
      const { id, velocity, channel } = action.payload;
      const noteState = new Map(state.noteState);
      noteState.set(id, { id, velocity, type: ControlType.NOTE });
      return {
        ...state,
        noteState,
        ...withMidiEvent(state, {
          direction: 'received',
          type: 'note_on',
          id,
          velocity,
          timestamp: Date.now(),
          channel,
        }),
      };
    }

    case ActionType.NOTE_OFF: {
      const { id, channel } = action.payload;
      const noteState = new Map(state.noteState);
      noteState.set(id, { id, velocity: 0, type: ControlType.NOTE });
      return {
        ...state,
        noteState,
        ...withMidiEvent(state, {
          direction: 'received',
          type: 'note_off',
          id,
          velocity: 0,
          timestamp: Date.now(),
          channel,
        }),
      };
    }

    case ActionType.CONTROL_CHANGE: {
      const { id, velocity, channel } = action.payload;
      const controlsState = new Map(state.controlsState);
      controlsState.set(id, { id, velocity, type: ControlType.CC });
      return {
        ...state,
        controlsState,
        ...withMidiEvent(state, {
          direction: 'received',
          type: 'cc',
          id,
          velocity,
          timestamp: Date.now(),
          channel,
        }),
      };
    }

    case ActionType.PANIC_ALL_OFF: {
      return {
        ...state,
        notesPressed: new Set(),
        controlsPressed: new Set(),
        noteState: new Map(),
        controlsState: new Map(),
        tapMode: Mode.Idle,
        ...withMidiEvent(state, {
          direction: 'sent',
          type: 'cc',
          id: 123,
          velocity: 0,
          timestamp: Date.now(),
        }),
      };
    }

    case ActionType.SELECT_CONTROL: {
      return {
        ...state,
        selectedControl: action.payload,
      };
    }

    case ActionType.SET_PAD_VELOCITY: {
      return {
        ...state,
        padVelocity: action.payload.velocity,
      };
    }

    case ActionType.SET_MIDI_CHANNEL: {
      return {
        ...state,
        midiChannel: action.payload.channel,
      };
    }

    case ActionType.SET_SHOW_PAD_LABELS: {
      return {
        ...state,
        showPadLabels: action.payload.show,
      };
    }

    case ActionType.CLEAR_MIDI_EVENTS: {
      return {
        ...state,
        lastMidiEvent: undefined,
        midiEvents: [],
      };
    }

    case ActionType.MIDI_ERROR: {
      return {
        ...state,
        lastMidiError: action.payload,
      };
    }

    case ActionType.PITCH_BEND: {
      return {
        ...state,
        ...withMidiEvent(state, {
          direction: action.payload.direction,
          type: 'pitch_bend',
          id: 0,
          value: action.payload.value,
          timestamp: Date.now(),
          channel: action.payload.channel ?? state.midiChannel,
        }),
      };
    }

    default:
      return state;
  }
};

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    SetChannel(state.midiChannel);
  }, []);

  React.useEffect(() => {
    EventsOn('note_on', (note: number, velocity: number, channel?: number) => {
      dispatch({
        type: ActionType.NOTE_ON,
        payload: { id: note as ControlId, velocity, channel: channel === undefined ? undefined : channel + 1 },
      });
    });

    EventsOn('note_off', (note: number, _velocity?: number, channel?: number) => {
      dispatch({
        type: ActionType.NOTE_OFF,
        payload: { id: note as ControlId, channel: channel === undefined ? undefined : channel + 1 },
      });
    });

    EventsOn('cc', (controller: number, velocity: number, channel?: number) => {
      dispatch({
        type: ActionType.CONTROL_CHANGE,
        payload: { id: controller as ControlId, velocity, channel: channel === undefined ? undefined : channel + 1 },
      });
    });

    EventsOn('pitch_bend', (value: number, channel?: number) => {
      dispatch({
        type: ActionType.PITCH_BEND,
        payload: { direction: 'received', value, channel: channel === undefined ? undefined : channel + 1 },
      });
    });

    return () => {
      EventsOff('note_on');
      EventsOff('note_off');
      EventsOff('cc');
      EventsOff('pitch_bend');
    };
  }, []);

  // Track which keyboard keys are currently pressed to prevent repeat events.
  const keysPressed = useRef(new Set<string>());

  React.useEffect(() => {
    const releaseHeldControls = () => {
      if (state.notesPressed.size === 0 && state.controlsPressed.size === 0 && state.tapMode === Mode.Idle) {
        return;
      }

      state.notesPressed.forEach((id) => {
        SendNoteOff(id);
      });
      state.controlsPressed.forEach((id) => {
        SendCCOff(id);
      });
      keysPressed.current.clear();
      dispatch({ type: ActionType.RESET_TAP_MODE });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        releaseHeldControls();
      }
    };

    window.addEventListener('blur', releaseHeldControls);
    window.addEventListener('pagehide', releaseHeldControls);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', releaseHeldControls);
      window.removeEventListener('pagehide', releaseHeldControls);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.tapMode, state.controlsPressed, state.notesPressed]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        changeTapMode(dispatch, Mode.ChordMajor);
      }

      if (e.shiftKey) {
        changeTapMode(dispatch, Mode.MultiTap);
      }

      const key = e.key.toLowerCase();
      const pad = keyToPadMap[key];
      if (pad !== undefined && !keysPressed.current.has(key)) {
        e.preventDefault();
        keysPressed.current.add(key);
        padDown(dispatch, pad as ControlId, state.padVelocity);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const pad = keyToPadMap[key];
      if (pad !== undefined) {
        e.preventDefault();
        keysPressed.current.delete(key);
        padUp(dispatch, pad as ControlId);
      }

      if (!e.shiftKey && !e.altKey && state.tapMode !== Mode.Idle) {
        state.controlsPressed.forEach((id) => {
          ccUp(dispatch, id);
        });
        state.notesPressed.forEach((id) => {
          padUp(dispatch, id);
        });
        dispatch({ type: ActionType.RESET_TAP_MODE });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state.tapMode, state.controlsPressed, state.notesPressed, state.padVelocity]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

const midiErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error || 'Unknown MIDI error');

function recordMidiError(dispatch: Dispatch, label: string, error: unknown) {
  dispatch({
    type: ActionType.MIDI_ERROR,
    payload: {
      label,
      message: midiErrorMessage(error),
      timestamp: Date.now(),
    },
  });
}

function runMidiCommand(dispatch: Dispatch, label: string, command: () => Promise<void> | void) {
  try {
    void Promise.resolve(command()).catch((error) => recordMidiError(dispatch, label, error));
  } catch (error) {
    recordMidiError(dispatch, label, error);
  }
}

function runMidiBatch(dispatch: Dispatch, label: string, commands: Array<() => Promise<void> | void>) {
  const tasks = commands.map((command) => {
    try {
      return Promise.resolve(command());
    } catch (error) {
      return Promise.reject(error);
    }
  });

  void Promise.allSettled(tasks).then((results) => {
    const failures = results.filter((result) => result.status === 'rejected') as PromiseRejectedResult[];
    if (failures.length > 0) {
      recordMidiError(dispatch, label, `${failures.length} MIDI message(s) failed: ${midiErrorMessage(failures[0].reason)}`);
    }
  });
}

export function padDown(dispatch: Dispatch, id: ControlId, velocity = 100) {
  dispatch({ type: ActionType.PAD_DOWN, payload: { id, velocity } });
  runMidiCommand(dispatch, `note on ${id}`, () => SendNoteOn(id, velocity));
}

export function padUp(dispatch: Dispatch, id: ControlId) {
  dispatch({ type: ActionType.PAD_UP, payload: { id } });
  runMidiCommand(dispatch, `note off ${id}`, () => SendNoteOff(id));
}

/**
 * ccDown - Send a cc on event to the push
 */
export function ccDown(dispatch: Dispatch, id: ControlId) {
  dispatch({
    type: ActionType.PAD_DOWN,
    payload: { id, type: ControlType.CC },
  });
  runMidiCommand(dispatch, `cc on ${id}`, () => SendCCOn(id));
}

/**
 * ccUp - Send a cc off event to the push
 */
export function ccUp(dispatch: Dispatch, id: ControlId) {
  dispatch({ type: ActionType.PAD_UP, payload: { id, type: ControlType.CC } });
  runMidiCommand(dispatch, `cc off ${id}`, () => SendCCOff(id));
}

export function changeTapMode(dispatch: Dispatch, mode: Mode) {
  dispatch({ type: ActionType.CHANGE_TAP_MODE, payload: { mode } });
}

export function panicAllOff(dispatch: Dispatch) {
  const commands: Array<() => Promise<void> | void> = [];
  for (let note = 0; note <= 127; note += 1) {
    commands.push(() => SendNoteOff(note));
  }

  for (let controller = 0; controller <= 127; controller += 1) {
    commands.push(() => SendCCOff(controller));
  }

  commands.push(() => SendCC(123, 0));
  commands.push(() => SendPitchBend(0));
  runMidiBatch(dispatch, 'panic reset', commands);
  dispatch({ type: ActionType.PANIC_ALL_OFF });
  dispatch({
    type: ActionType.PITCH_BEND,
    payload: { direction: 'sent', value: 0 },
  });
}

export function sendTestNote(
  dispatch: Dispatch,
  note: ControlId = 60 as ControlId,
  velocity = 100
) {
  padDown(dispatch, note, velocity);
  window.setTimeout(() => {
    padUp(dispatch, note);
  }, 180);
}

export function sendTestCC(dispatch: Dispatch, controller: ControlId = ControlId.DELETE) {
  ccDown(dispatch, controller);
  window.setTimeout(() => {
    ccUp(dispatch, controller);
  }, 180);
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }

    const timeout = window.setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timeout);
        resolve();
      },
      { once: true }
    );
  });

export async function sendPadSweep(dispatch: Dispatch, velocity = 100, signal?: AbortSignal) {
  const safeVelocity = Math.max(1, Math.min(127, Math.round(velocity)));

  for (let note = 36; note <= 99; note += 1) {
    if (signal?.aborted) break;

    padDown(dispatch, note as ControlId, safeVelocity);
    await wait(35, signal);
    padUp(dispatch, note as ControlId);
    if (signal?.aborted) break;
    await wait(15, signal);
  }
}

export async function sendCommonCCSweep(dispatch: Dispatch, signal?: AbortSignal) {
  const controllers = [
    ...Array.from({ length: 8 }, (_, index) => 102 + index),
    ...Array.from({ length: 8 }, (_, index) => 20 + index),
    29,
    44,
    45,
    46,
    47,
    54,
    55,
    56,
    57,
    58,
    60,
    61,
    62,
    63,
    85,
    86,
    110,
    112,
    113,
    118,
    119,
  ];

  for (const controller of controllers) {
    if (signal?.aborted) break;

    ccDown(dispatch, controller as ControlId);
    await wait(45, signal);
    ccUp(dispatch, controller as ControlId);
    if (signal?.aborted) break;
    await wait(20, signal);
  }
}

export function selectControl(dispatch: Dispatch, control: SelectedControl) {
  dispatch({ type: ActionType.SELECT_CONTROL, payload: control });
}

export function setPadVelocity(dispatch: Dispatch, velocity: number) {
  const safeVelocity = Math.max(1, Math.min(127, Math.round(velocity)));
  writeStoredValue(STORAGE_KEYS.padVelocity, safeVelocity);
  dispatch({ type: ActionType.SET_PAD_VELOCITY, payload: { velocity: safeVelocity } });
}

export async function releaseHeldMidi(dispatch: Dispatch, heldState?: HeldMidiState) {
  const heldNotes = Array.from(heldState?.notesPressed ?? []);
  const heldControls = Array.from(heldState?.controlsPressed ?? []);

  if (heldNotes.length === 0 && heldControls.length === 0) {
    return false;
  }

  const results = await Promise.allSettled([
    ...heldNotes.map((note) => SendNoteOff(note)),
    ...heldControls.map((controller) => SendCCOff(controller)),
    SendPitchBend(0),
  ]);
  const failures = results.filter((result) => result.status === 'rejected') as PromiseRejectedResult[];
  if (failures.length > 0) {
    recordMidiError(dispatch, 'release held MIDI', `${failures.length} MIDI message(s) failed: ${midiErrorMessage(failures[0].reason)}`);
  }

  dispatch({ type: ActionType.RESET_TAP_MODE });
  dispatch({ type: ActionType.PITCH_BEND, payload: { direction: 'sent', value: 0 } });
  return true;
}

export async function setMidiChannel(
  dispatch: Dispatch,
  channel: number,
  heldState?: HeldMidiState
) {
  const safeChannel = Math.max(1, Math.min(16, Math.round(channel)));

  // Release anything held on the current backend channel before switching.
  // Otherwise a note-on can be sent on channel N and the note-off on channel M.
  await releaseHeldMidi(dispatch, heldState);

  try {
    await SetChannel(safeChannel);
  } catch (error) {
    recordMidiError(dispatch, 'set channel', error);
    return;
  }

  writeStoredValue(STORAGE_KEYS.midiChannel, safeChannel);
  dispatch({ type: ActionType.SET_MIDI_CHANNEL, payload: { channel: safeChannel } });
}

export function setShowPadLabels(dispatch: Dispatch, show: boolean) {
  writeStoredValue(STORAGE_KEYS.showPadLabels, show);
  dispatch({ type: ActionType.SET_SHOW_PAD_LABELS, payload: { show } });
}

export function clearMidiEvents(dispatch: Dispatch) {
  dispatch({ type: ActionType.CLEAR_MIDI_EVENTS });
}

export function sendPitchBend(dispatch: Dispatch, value: number) {
  const safeValue = Math.max(-8192, Math.min(8191, Math.round(value)));
  runMidiCommand(dispatch, `pitch bend ${safeValue}`, () => SendPitchBend(safeValue));
  dispatch({
    type: ActionType.PITCH_BEND,
    payload: { direction: 'sent', value: safeValue },
  });
}

export function useAppState() {
  const context = React.useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a AppProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = React.useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within a AppProvider');
  }
  return context;
}

export default {
  useAppState,
  useAppDispatch,
};
