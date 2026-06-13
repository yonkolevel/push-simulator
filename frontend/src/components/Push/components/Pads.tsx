import { range } from 'lodash';
import React from 'react';
import { Colors, pushColorToHexMap } from '../../../libs/push2/colors';
import { useAppState } from '../../../libs/push2/context/PushContext';
import { ControlType } from '../../../libs/push2/controls';
import { getNoteOctave, inScale, isRootNote, Mode } from '../../../libs/push2/core';
import Control from '../Control';

const UNLIT_PAD = '#242625';
const IN_SCALE_PAD = '#293331';
const ROOT_PAD = '#244239';
const STROKE = '#111312';

const Pad: React.FunctionComponent<{
  id: string;
  x: number;
  y: number;
  color: string;
  isActive: boolean;
  label: string;
}> = React.memo(({ id, x = 76, y = 305, color, isActive, label, ...props }) => {
  const width = 29.23;
  const height = 20.58;

  return (
    <g>
      <rect
        {...props}
        key={id}
        id={id}
        width={width}
        height={height}
        rx="1.8"
        fillOpacity={1}
        fill={color}
        y={isActive ? y + 0.6 : y}
        x={x}
        stroke={isActive ? '#9fffee' : STROKE}
        strokeWidth={isActive ? 0.85 : 0.45}
        filter={isActive ? 'drop-shadow(0 0 3px rgba(0, 210, 190, 0.65))' : undefined}
      />
      <text
        x={x + width / 2}
        y={y + height / 2 + 1.8}
        textAnchor="middle"
        fill={isActive ? '#dffff9' : '#74807b'}
        fontSize="4.2"
        fontFamily="monospace"
        opacity={isActive ? 0.95 : 0.42}
        pointerEvents="none"
      >
        {label}
      </text>
    </g>
  );
});

const resolvePadColor = (pad: number, velocity: number | undefined, isPressed: boolean) => {
  if (isPressed) {
    return Colors.Teal;
  }

  if (velocity && velocity > 0) {
    return pushColorToHexMap[velocity] || Colors.Blue;
  }

  const position = pad - 36;
  const row = Math.floor(position / 8);
  const col = position % 8;
  const note = getNoteOctave(row, col);

  if (isRootNote(note.note)) {
    return ROOT_PAD;
  }

  if (inScale(note.note)) {
    return IN_SCALE_PAD;
  }

  return UNLIT_PAD;
};

interface PadsProps {
  onMouseDown?: (id: string) => void;
}

const SvgPads: React.FunctionComponent<PadsProps> = () => {
  const { noteState, notesPressed, tapMode, showPadLabels } = useAppState();

  const pads: Array<{
    id: string;
    key: string;
    y: number;
    x: number;
    note: number;
    color: string;
    isActive: boolean;
    label: string;
  }> = [];
  const width = 29.23;
  const height = 20.58;
  let pad = 36;

  range(0, 8).forEach((row) => {
    range(0, 8).forEach((col) => {
      const x = Number((76 + (width + 3.13) * col).toFixed(2));
      const y = Number((305 - (height + 3.6) * row).toFixed(2));
      const padState = noteState.get(pad);
      const isPressed = notesPressed.has(pad);
      const note = getNoteOctave(row, col);

      pads.push({
        id: `pad_${pad}`,
        key: `pad_${pad}`,
        y,
        x,
        note: pad,
        color: resolvePadColor(pad, padState?.velocity, isPressed),
        isActive: isPressed || Boolean(padState?.velocity),
        label: showPadLabels || tapMode === Mode.MultiTap || isPressed ? `${note.note}${note.octave}` : '',
      });
      pad += 1;
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
          <Pad {...p} />
        </Control>
      ))}
    </>
  );
};

export default SvgPads;
