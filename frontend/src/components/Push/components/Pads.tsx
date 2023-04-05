import { range } from "lodash";
import React from "react";
import { Colors, pushColorToHexMap } from "../../../libs/push2/colors";
import {
  useAppDispatch,
  useAppState
} from "../../../libs/push2/context/PushContext";
import { ControlType } from "../../../libs/push2/controls";
import { Mode } from "../../../libs/push2/core";
import Control from "../Control";

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
        fill={color}
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
  const { noteState, notesPressed, tapMode } = useAppState();

  const dispatch = useAppDispatch();

  const pads: any[] = [];
  const width = 29.23;
  const height = 20.58;
  let pad = 36;

  range(0, 8).forEach((row) => {
    range(0, 8).forEach((col) => {
      let x = Number((76 + (width + 3.13) * col).toFixed(2));
      let y = Number((305 - (height + 3.6) * row).toFixed(2));
      const padState = noteState.get(pad);

      var color = pushColorToHexMap[padState?.velocity || 0];
      const multiTapOverrideColor =
        tapMode === Mode.MultiTap && notesPressed.has(pad)
          ? Colors.Teal
          : undefined;

      pads.push({
        id: `pad_${pad}`,
        key: `pad_${pad}`,
        y: y,
        x: x,
        note: pad,
        color: multiTapOverrideColor || color
      });
      pad = pad + 1;
    });
  });

  return (
    <>
      {pads.map((p) => (
        <Control
          key={p.note}
          controlId={p.note}
          name={`pad_${p.note}`}
          type={ControlType.NOTE}
          color={p.color}
        >
          <Pad key={p.key} {...p} />
        </Control>
      ))}
    </>
  );
};

export default SvgPads;
