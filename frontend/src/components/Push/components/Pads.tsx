import { range } from "lodash";
import React, { useState } from "react";
import {
  padDown,
  padUp,
  useAppDispatch,
  useAppState
} from "../../../libs/push2/context/PushContext";
import { getPadColor, Mode } from "../../../libs/push2/core";
import {
  NoteState,
  PadColor,
  velocityToHexColor
} from "../../../libs/push2/types";

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
        fill={isOn ? velocityToHexColor(PadColor.PRESSED) : color}
        y={y}
        x={x}
        onMouseDown={onMouseDown}
      >
        <text style={{ color: "red" }}>{id}</text>
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
  const { notesPressed: controlsPressed, tapMode } = useAppState();
  const dispatch = useAppDispatch();

  const pads: any[] = [];
  const width = 29.23;
  const height = 20.58;
  let pad = 36;

  range(0, 8).forEach((row) => {
    range(0, 8).forEach((col) => {
      let x = Number((76 + (width + 3.13) * col).toFixed(2));
      let y = Number((305 - (height + 3.6) * row).toFixed(2));
      pads.push({
        id: `pad_${pad}`,
        key: `pad_${pad}`,
        isOn: controlsPressed.has(pad),
        y: y,
        x: x,
        note: pad,
        color: getPadColor(row, col, tapMode)
      });
      pad = pad + 1;
    });
  });

  const handleMouseDown = (note: NoteState) => {};

  const handleMouseUp = () => {};

  const handleMouseLeave = () => {};

  return (
    <>
      {pads.map((p) => (
        <Pad
          onMouseDown={() => {
            padDown(dispatch, p.note);
          }}
          onMouseUp={() => {
            padUp(dispatch, p.note);
          }}
          key={p.key}
          {...p}
        />
      ))}
    </>
  );
};

export default SvgPads;
