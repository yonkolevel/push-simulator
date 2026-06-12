import React, { createContext, useReducer, useRef } from 'react';
import { ControlId, ControlType } from '../controls';
import {
  SendCCOn,
  SendCCOff,
  SendNoteOff,
  SendNoteOn,
} from '../../../../wailsjs/go/push/AbletonPush';
import { EventsOff, EventsOn } from '../../../../wailsjs/runtime/runtime';
import { Mode } from '../core';

// Keyboard to pad mapping (4 rows of 8 keys = 32 pads)
// Maps to bottom 4 rows of the Push 2 pad grid
const keyToPadMap: Record<string, number> = {
  // Row 1 (bottom): Z X C V B N M , → Pads 36-43
  'z': 36, 'x': 37, 'c': 38, 'v': 39, 'b': 40, 'n': 41, 'm': 42, ',': 43,
  // Row 2: A S D F G H J K → Pads 44-51
  'a': 44, 's': 45, 'd': 46, 'f': 47, 'g': 48, 'h': 49, 'j': 50, 'k': 51,
  // Row 3: Q W E R T Y U I → Pads 52-59
  'q': 52, 'w': 53, 'e': 54, 'r': 55, 't': 56, 'y': 57, 'u': 58, 'i': 59,
  // Row 4 (top): 1 2 3 4 5 6 7 8 → Pads 60-67
  '1': 60, '2': 61, '3': 62, '4': 63, '5': 64, '6': 65, '7': 66, '8': 67,
};

enum ActionType {
  PAD_DOWN,
  PAD_UP,
  CHANGE_TAP_MODE,
  RESET_TAP_MODE,
  NOTE_ON,
  NOTE_OFF,
  CONTROL_CHANGE,
}

interface Action {
  type: ActionType;
  payload?: any;
}

type ControlState = {
  id: ControlId;
  type: ControlType;
  velocity: number;
};

type AppState = {
  notesPressed: Set<ControlId>;
  controlsPressed: Set<ControlId>;
  noteState: Map<ControlId, ControlState>;
  controlsState: Map<ControlId, ControlState>;
  tapMode: Mode;
};

type Dispatch = (action: Action) => void;
type AppProviderPros = { children: React.ReactNode };
const AppStateContext = createContext<AppState | undefined>(undefined);

const AppDispatchContext = React.createContext<Dispatch | undefined>(undefined);

const initialState: AppState = {
  notesPressed: new Set(),
  controlsPressed: new Set(),
  controlsState: new Map(),
  noteState: new Map(),
  tapMode: Mode.Idle,
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case ActionType.PAD_DOWN: {
      const { id, type } = action.payload;
      if (type == ControlType.CC) {
        state.controlsPressed.add(id);
      } else {
        state.notesPressed.add(id);
      }

      return {
        ...state,
      };
    }

    case ActionType.PAD_UP: {
      if (state.tapMode == Mode.MultiTap) {
        return state;
      }

      const { id, type } = action.payload;
      if (type == ControlType.CC) {
        state.controlsPressed.delete(id);
      } else {
        state.notesPressed.delete(id);
      }
      return {
        ...state,
      };
    }

    case ActionType.CHANGE_TAP_MODE: {
      const mode = action.payload.mode;

      return {
        ...state,
        tapMode: mode,
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
      const { id, velocity } = action.payload;
      state.noteState.set(id, { id, velocity, type: ControlType.NOTE });
      return {
        ...state,
      };
    }

    case ActionType.NOTE_OFF: {
      const { id } = action.payload;
      state.noteState.set(id, { id, velocity: 0, type: ControlType.NOTE });
      return {
        ...state,
      };
    }

    case ActionType.CONTROL_CHANGE: {
      console.log(action.payload);
      const { id, velocity } = action.payload;
      state.controlsState.set(id, { id, velocity, type: ControlType.CC });
      return {
        ...state,
      };
    }

    default:
      return state;
  }
};

export function AppProvider({ children }: AppProviderPros) {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    EventsOn('note_on', (note: number, velocity) => {
      console.log('note_on');
      dispatch({
        type: ActionType.NOTE_ON,
        payload: { id: note, velocity: velocity },
      });
    });

    EventsOn('note_off', (note: number) => {
      console.log('note_off');
      dispatch({
        type: ActionType.NOTE_OFF,
        payload: { id: note },
      });
    });

    EventsOn('cc', (controller: number, velocity: number) => {
      dispatch({
        type: ActionType.CONTROL_CHANGE,
        payload: { id: controller, velocity },
      });
    });

    return () => {
      EventsOff('note_on');
      EventsOff('note_off');
      EventsOff('cc');
    };
  });

  // Track which keyboard keys are currently pressed to prevent repeat events
  const keysPressed = useRef(new Set<string>());

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle modifier keys for tap modes
      if (e.altKey) {
        changeTapMode(dispatch, Mode.ChordMajor);
      }

      if (e.shiftKey) {
        changeTapMode(dispatch, Mode.MultiTap);
      }

      // Handle pad keys
      const key = e.key.toLowerCase();
      const pad = keyToPadMap[key];
      if (pad !== undefined && !keysPressed.current.has(key)) {
        keysPressed.current.add(key);
        padDown(dispatch, pad);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Handle pad key release
      const key = e.key.toLowerCase();
      const pad = keyToPadMap[key];
      if (pad !== undefined) {
        keysPressed.current.delete(key);
        padUp(dispatch, pad);
      }

      // Handle modifier key release
      if (!e.shiftKey && !e.altKey) {
        // Only reset if no modifiers are held
        if (state.tapMode !== Mode.Idle) {
          state.controlsPressed.forEach((id) => {
            ccUp(dispatch, id);
          });
          state.notesPressed.forEach((id) => {
            padUp(dispatch, id);
          });
          dispatch({ type: ActionType.RESET_TAP_MODE });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state.tapMode, state.controlsPressed, state.notesPressed]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function padDown(dispatch: Dispatch, id: ControlId) {
  dispatch({ type: ActionType.PAD_DOWN, payload: { id } });
  SendNoteOn(id, 127);
}

export function padUp(dispatch: Dispatch, id: ControlId) {
  dispatch({ type: ActionType.PAD_UP, payload: { id } });
  SendNoteOff(id);
}

/**
 * ccDown - Send a cc on event to the push
 * @param dispatch
 * @param id
 */
export function ccDown(dispatch: Dispatch, id: ControlId) {
  dispatch({
    type: ActionType.PAD_DOWN,
    payload: { id, type: ControlType.CC },
  });
  SendCCOn(id);
}

/**
 * ccUp - Send a cc off event to the push
 * @param dispatch
 * @param id
 */
export function ccUp(dispatch: Dispatch, id: ControlId) {
  dispatch({ type: ActionType.PAD_UP, payload: { id, type: ControlType.CC } });
  SendCCOff(id);
}

export function changeTapMode(dispatch: Dispatch, mode: Mode) {
  dispatch({ type: ActionType.CHANGE_TAP_MODE, payload: { mode } });
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
