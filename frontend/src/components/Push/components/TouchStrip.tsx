import * as React from "react";
import { animated, useSpring } from "react-spring";
import { useGesture, useMove } from "@use-gesture/react";
import { sendPitchBend, useAppDispatch } from "../../../libs/push2/context/PushContext";

const stripHeight = 190.45;
const diameter = 3;
const pitchBendMax = 8191;

const toPitchBend = (movementY: number) => {
  const clamped = Math.max(-stripHeight / 2, Math.min(stripHeight / 2, movementY));
  return Math.round((-clamped / (stripHeight / 2)) * pitchBendMax);
};

const SvgTouchStrip = (props: React.SVGProps<SVGSVGElement>) => {
  const dispatch = useAppDispatch();
  const [{ y }, set] = useSpring(() => ({ y: 0 }));
  const dots = Array(1).fill(1);
  const circleX = 44;
  let circleY = 328 - Math.round(stripHeight / 2) + diameter * dots.length;

  const sendBend = React.useCallback(
    (value: number) => {
      sendPitchBend(dispatch, value);
    },
    [dispatch]
  );

  const handleDragMode = React.useCallback(
    (down: boolean, my: number) => {
      const visualY = Math.max(
        -Math.round(stripHeight / 2 - diameter * dots.length),
        Math.min(Math.round(stripHeight / 2 - diameter * dots.length), my)
      );
      set({ y: down ? visualY : 0 });
      sendBend(down ? toPitchBend(my) : 0);
    },
    [dots.length, sendBend, set]
  );

  const handleTouchMode = React.useCallback(
    (my: number) => {
      const value = toPitchBend(my);
      set({ y: value > 0 ? -Math.round(stripHeight / 2 - diameter * dots.length) : Math.round(stripHeight / 2 - diameter * dots.length) });
      sendBend(value);
    },
    [dots.length, sendBend, set]
  );

  const bindMove = useMove(({ movement: [, my], down }) => {
    down && handleTouchMode(my);
  });

  const bind = useGesture({
    onDrag: ({ down, movement: [, my] }) => {
      handleDragMode(down, my);
    },
    onMouseDown: () => sendBend(0),
    onMouseUp: () => sendBend(0),
  });

  return (
    <g id="touch-strip" {...bind()} {...bindMove()} {...props}>
      <title>touch-strip — Pitch Bend</title>
      <path
        id="Vector_143"
        d="M64.16 135.58H41.12v190.45h23.04V135.58z"
        fill="#3C3C3B"
      />
      <animated.g style={{ y }} width={20} x={44} y={328 - 95.25}>
        {dots.map((index) => {
          circleY = circleY - (index + 1) * 3;

          return (
            <circle
              key={circleY}
              fill="white"
              cx={circleX}
              cy={circleY}
              r={diameter / 2}
            />
          );
        })}
      </animated.g>
    </g>
  );
};

export default SvgTouchStrip;
