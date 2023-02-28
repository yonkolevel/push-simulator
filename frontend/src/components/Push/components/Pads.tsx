import { range } from "lodash";
import  React, { useState} from "react";
import {
  SendNoteOff,
  SendNoteOn
} from "../../../../wailsjs/go/push/AbletonPush";
import { ControlId } from "../../../libs/push2/controls";
import { getPadColor, getPadValue, Mode } from "../../../libs/push2/core";
import { useDeviceNoteState } from "../../../libs/push2/react/hooks";
import { EventsOn } from "../../../../wailsjs/runtime/runtime";

const Pad: React.FunctionComponent<{
  isOn?: boolean;
  id: string;
  x: number;
  y: number;
  onMouseDown: () => void;
  color: string;
}> = React.memo(
  ({ isOn, id, x = 76, y = 305, onMouseDown, color, ...props }) => {
    const width = 29.23,
      height = 20.58;

    return (
      <rect
        {...props}
        key={id}
        id={id}
        width={width}
        height={height}
        fillOpacity={1}
        fill={isOn ? "rgba(0, 255, 0, 1)" : color}
        y={y}
        x={x}
        onMouseDown={onMouseDown}
      >
        <text style={{color: "red"}}>{id}</text>
      </rect>
    );
  }
);

interface PadsProps {
  onMouseDown: (id: string) => void;
}


enum Key {
  Option = 18
}

const SvgPads: React.FunctionComponent<PadsProps> = (props) => {
  const [mode, setMode] = useState(Mode.DefaultOn);
  const {notesState, updateNotesState} = useDeviceNoteState()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === Key.Option) {
        setMode(Mode.ChordMajor);
      }
    };

    const handleKeyUp = () => {
      setMode(Mode.Default);
    };

    window.addEventListener("keydown", handleKeyDown);

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);




  const pads: any[] = [];
  const width = 29.23;
  const height = 20.58;
  let pad = 11;

  range(0, 8).forEach((row) => {
    range(0, 8).forEach((col) => {
      let x = Number((76 + (width + 3.13) * col).toFixed(2));
      let y = Number((305 - (height + 3.6) * row).toFixed(2));
      pads.push({
        id: `pad_${pad}`,
        key: `pad_${pad}`,
        isOn: notesState.get(pad)?.isOn,
        y: y,
        x: x,
        note: pad,
        color: getPadColor(row, col, mode)
      });
      pad = pad + 1;
    });
  });

  // console.log("pad value is:", getPadValue(0, 7));
  // console.log("color is: ", getPadColor(0, 7));
  return (
    <>
      {pads.map((p) => (
        <Pad
          onMouseLeave={() => {
            if (notesState.get(p.note)?.isOn) {
              // should be converted to a reset chord func
              updateNotesState(p.note, { isOn: false });
              updateNotesState(p.note + 2, { isOn: false });
              updateNotesState(p.note + 9, { isOn: false });
            }
          }}
          onMouseDown={() => {
            if (mode === Mode.ChordMajor) {
              updateNotesState(p.note, { isOn: true });
              updateNotesState(p.note + 2, { isOn: true });
              updateNotesState(p.note + 9, { isOn: true });
            } else {
              updateNotesState(p.note, { isOn: true });
            }

            SendNoteOn(p.note, 127);
            console.log(p.note)
          }}
          onMouseUp={() => {
            if (mode === Mode.ChordMajor) {
              updateNotesState(p.note, { isOn: false });
              updateNotesState(p.note + 2, { isOn: false });
              updateNotesState(p.note + 9, { isOn: false });
            } else {
              updateNotesState(p.note, { isOn: false });
            }
            SendNoteOff(p.note);
          }}
          key={p.key}
          {...p}
        />
      ))}
    </>
  );
};

export default SvgPads;
