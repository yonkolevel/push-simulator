import * as React from "react";
import { SendCC, SendCCNoteOff } from "../../../../wailsjs/go/push/AbletonPush";
import { EventsOff, EventsOn } from "../../../../wailsjs/runtime/runtime";
import { ControlId } from "../controls";
import { ButtonColor, NoteState } from "../types";

export const useToggleControl = (
  controlId: ControlId,
  mode: "one-way" | "2-ways" = "2-ways",
  color: ButtonColor = ButtonColor.WHITE
) => {
  if (typeof window === "undefined" || typeof window.backend === "undefined") {
    // throw new Error("window.backend global is not available.");
    return { isOn: false, toggleControl: () => {} };
  }

  const [isOn, setIsOn] = React.useState(false);

  const toggleControl = () => {
    setIsOn((v) => {
      if (!v) {
        SendCC(controlId, color).then((err: any) => {
          console.log(err);
        });
      }

      if (v) {
        SendCCNoteOff(controlId).then((err: any) => {
          if (!err) {
            console.log(err);
          }
        });
      }

      return !v;
    });
  };

  React.useEffect(() => {
    EventsOn("cc", (controller: number, value: number) => {
      if (controller !== controlId) {
        return;
      }

      if (!isOn && value === 127) {
        console.log("is not on and value 127");
        toggleControl();
      } else if (isOn && value === 127) {
        console.log("is on so...");
        console.log("set is off");
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
      console.log("note on message", note);
      updateMap(note, { isOn: true });
    });

    EventsOn("note_off", (note: number) => {
      console.log("note off message", note);
      updateMap(note, { isOn: false });
    });

    return () => {
      EventsOff("note_on");
      EventsOff("note_off");
    };
  });

  return { notesState: notesStateMap, updateNotesState: updateMap };
};
