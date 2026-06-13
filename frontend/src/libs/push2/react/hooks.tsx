import * as React from "react";
import { SendCC, SendCCOff } from "../../../../wailsjs/go/push/AbletonPush";
import { EventsOff, EventsOn } from "../../../../wailsjs/runtime/runtime";
import { ControlId } from "../controls";
import { ButtonColor, NoteState } from "../types";

export const useToggleControl = (
  controlId: ControlId,
  mode: "one-way" | "2-ways" = "2-ways",
  color: ButtonColor = ButtonColor.WHITE
) => {
  const [isOn, setIsOn] = React.useState(false);

  const toggleControl = () => {
    setIsOn((v) => {
      if (!v) {
        SendCC(controlId, color);
      }

      if (v) {
        SendCCOff(controlId);
      }

      return !v;
    });
  };

  React.useEffect(() => {
    EventsOn("cc", (controller: number, value: number) => {
      if (controller !== controlId) {
        return;
      }

      if (value === 127) {
        toggleControl();
      }
    });
  }, []);

  return { isOn, toggleControl };
};

export const useDeviceNoteState = () => {
  const [notesStateMap, setNotesStateMap] = React.useState<
    Map<ControlId, NoteState>
  >(new Map<ControlId, NoteState>());

  const updateMap = React.useCallback(
    (k: number, v: NoteState) => {
      setNotesStateMap(new Map(notesStateMap.set(k, v)));
    },
    [notesStateMap]
  );

  React.useEffect(() => {
    EventsOn("note_on", (note: number) => {
      updateMap(note, { isOn: true });
    });

    EventsOn("note_off", (note: number) => {
      updateMap(note, { isOn: false });
    });

    return () => {
      EventsOff("note_on");
      EventsOff("note_off");
    };
  });

  return { notesState: notesStateMap, updateNotesState: updateMap };
};
