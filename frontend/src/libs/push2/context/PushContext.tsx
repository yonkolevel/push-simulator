import React, { createContext, useReducer } from "react";
import { ControlId, ControlType } from "../controls";
import {
  SendCCOn,
  SendCCOff,
  SendNoteOff,
  SendNoteOn
} from "../../../../wailsjs/go/push/AbletonPush";
import { EventsOff, EventsOn } from "../../../../wailsjs/runtime/runtime";
import { Mode } from "../core";

enum ActionType {
  PAD_DOWN,
  PAD_UP,
  CHANGE_TAP_MODE,
  RESET_TAP_MODE,
  NOTE_ON,
  NOTE_OFF,
  CONTROL_CHANGE
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
  tapMode: Mode.Idle
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
        ...state
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
        ...state
      };
    }

    case ActionType.CHANGE_TAP_MODE: {
      const mode = action.payload.mode;

      return {
        ...state,
        tapMode: mode
      };
    }

    case ActionType.RESET_TAP_MODE: {
      return {
        ...state,
        tapMode: Mode.Idle,
        notesPressed: new Set(),
        controlsPressed: new Set()
      };
    }

    case ActionType.NOTE_ON: {
      const { id, velocity } = action.payload;
      state.noteState.set(id, { id, velocity, type: ControlType.NOTE });
      return {
        ...state
      };
    }

    case ActionType.NOTE_OFF: {
      const { id } = action.payload;
      state.noteState.set(id, { id, velocity: 0, type: ControlType.NOTE });
      return {
        ...state
      };
    }

    case ActionType.CONTROL_CHANGE: {
      const { id, velocity } = action.payload;
      state.controlsState.set(id, { id, velocity, type: ControlType.CC });
      return {
        ...state
      };
    }

    default:
      return state;
  }
};

export function AppProvider({ children }: AppProviderPros) {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    EventsOn("note_on", (note: number, velocity) => {
      console.log("note_on")
      dispatch({
        type: ActionType.NOTE_ON,
        payload: { id: note, velocity: velocity }
      });
    });

    EventsOn("note_off", (note: number) => {
      console.log("note_off")
      dispatch({
        type: ActionType.NOTE_OFF,
        payload: { id: note }
      });
    });

    EventsOn("cc", (controller: number, velocity: number) => {
      dispatch({
        type: ActionType.CONTROL_CHANGE,
        payload: { id: controller, velocity }
      });
    });

    return () => {
      EventsOff("note_on");
      EventsOff("note_off");
      EventsOff("cc");
    };
  });

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        changeTapMode(dispatch, Mode.ChordMajor);
      }

      if (e.shiftKey) {
        changeTapMode(dispatch, Mode.MultiTap);
        console.log("MultiTap mode");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        state.controlsPressed.forEach((id) => {
          ccUp(dispatch, id);
          padUp(dispatch, id);
        });
      }

      dispatch({ type: ActionType.RESET_TAP_MODE });
    };

    window.addEventListener("keydown", handleKeyDown);

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

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
    payload: { id, type: ControlType.CC }
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
    throw new Error("useAppState must be used within a AppProvider");
  }
  return context;
}

export function useAppDispatch() {
  const context = React.useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error("useAppDispatch must be used within a AppProvider");
  }
  return context;
}

export default {
  useAppState,
  useAppDispatch
};
