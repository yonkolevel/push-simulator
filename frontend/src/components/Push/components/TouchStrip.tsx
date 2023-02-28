import * as React from "react";
import { animated, useSpring } from "react-spring";
import { useGesture, useMove } from "react-use-gesture";
import { SendPitchBend } from "../../../../wailsjs/go/push/AbletonPush";

enum Mode {
  Touch = "touch",
  Drag = "drag"
}

const SvgTouchStrip = (props: React.SVGProps<SVGSVGElement>) => {
  const [mode, setMode] = React.useState(Mode.Drag);

  const stripHeight = 190.45;
  const diameter = 3;
  const [{ y }, set] = useSpring(() => ({ y: 0 }));
  const dots = Array(1).fill(1);
  const circleX = 44;
  let circleY = 328 - Math.round(stripHeight / 2) + diameter * dots.length;

  const handleMouseDown = React.useCallback(() => {
    SendPitchBend(127);
  }, [window]);

  const handleMouseUp = React.useCallback(() => {
    SendPitchBend(0);
  }, [window]);

  // Set the drag hook and define component movement based on gesture data

  React.useEffect(() => {
    if (dots.length > 1) {
      setMode(Mode.Touch);
    } else {
      setMode(Mode.Drag);
    }
  }, [dots]);

  const handleDragMode = React.useCallback((down: boolean, my: number) => {
    if (Math.abs(my) >= stripHeight / 2 && my > 0) {
      set({
        y: down ? Math.round(stripHeight / 2 - diameter * dots.length) : 0
      });
    } else if (Math.abs(my) >= stripHeight / 2 && my < 0) {
      set({
        y: down ? -Math.round(stripHeight / 2 - diameter * dots.length) : 0
      });
    } else {
      set({ y: down ? my : 0 });
    }

    if (!down) {
      handleMouseUp();
    }
  }, []);

  const handleTouchMode = React.useCallback((my: number) => {
    const regionSize = Math.floor(stripHeight / (dots.length * diameter));
    console.log(regionSize);
    console.log(Math.abs(my));
    if (Math.abs(my) <= regionSize || Math.abs(my) > 0) {
      // its in region one
      set({ y: -Math.round(stripHeight / 2 - diameter * dots.length) });
      return;
    }

    if (Math.abs(my) <= regionSize * 2 || Math.abs(my) > regionSize) {
      // its in region one
      set({ y: regionSize * 2 });
      return;
    }
  }, []);

  const bindMove = useMove(({ movement: [mx, my], down, xy }) => {
    if (mode === Mode.Touch) {
      // console.log(offset);
      console.log(my);
      // console.log(values);
      console.log("touching");
      down && handleTouchMode(my);
    }
  });
  const bind = useGesture({
    onDrag: ({ down, movement: [mx, my] }) => {
      if (mode === Mode.Drag) {
        console.log("dragging");
        handleDragMode(down, my);
      }
    },
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp
  });

  return (
    <g id="touch-strip" {...bind()} {...bindMove()}>
      <path
        id="Vector_143"
        d="M64.16 135.58H41.12v190.45h23.04V135.58z"
        fill="#3C3C3B"
      />
      {
        <animated.g style={{ y }} width={20} x={44} y={328 - 95.25}>
          {dots.map((index, d) => {
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
      }
    </g>
  );
};

export default SvgTouchStrip;
