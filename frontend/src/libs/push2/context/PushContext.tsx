import React, { createContext, useReducer } from "react";
import { ControlId } from "../controls";
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
  RESET_TAP_MODE
}

interface Action {
  type: ActionType;
  payload?: any;
}

type AppState = {
  notesPressed: Set<ControlId>;
  controlsPressed: Set<ControlId>;
  tapMode: Mode;
};

type Dispatch = (action: Action) => void;
type AppProviderPros = { children: React.ReactNode };
const AppStateContext = createContext<AppState | undefined>(undefined);

const AppDispatchContext = React.createContext<Dispatch | undefined>(undefined);

const initialState: AppState = {
  notesPressed: new Set(),
  controlsPressed: new Set(),
  tapMode: Mode.Idle
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case ActionType.PAD_DOWN: {
      const pad = action.payload.id;
      console.log(pad);
      return {
        ...state,
        notesPressed: state.notesPressed.add(pad)
      };
    }

    case ActionType.PAD_UP: {
      if (state.tapMode == Mode.MultiTap) {
        return state;
      }

      const pad = action.payload.id;
      state.notesPressed.delete(pad);
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
        notesPressed: new Set()
      };
    }

    default:
      return state;
  }
};

export function AppProvider({ children }: AppProviderPros) {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    EventsOn("note_on", (note: number) => {
      padDown(dispatch, note);
    });

    EventsOn("note_off", (note: number) => {
      padUp(dispatch, note);
    });

    return () => {
      EventsOff("note_on");
      EventsOff("note_off");
    };
  });

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        changeTapMode(dispatch, Mode.ChordMajor);
      }

      if (e.shiftKey) {
        changeTapMode(dispatch, Mode.MultiTap);
      }
    };

    const handleKeyUp = () => {
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
  dispatch({ type: ActionType.PAD_DOWN, payload: { id } });
  SendCCOn(id);
}

/**
 * ccUp - Send a cc off event to the push
 * @param dispatch
 * @param id
 */
export function ccUp(dispatch: Dispatch, id: ControlId) {
  dispatch({ type: ActionType.PAD_UP, payload: { id } });
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
