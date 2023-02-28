import styled from '@emotion/styled';
import * as React from 'react';
import { animated, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import { Colors } from '../../../libs/push2/colors';
import { ControlId } from '../../../libs/push2/controls';
import { useToggleControl } from '../../../libs/push2/react/hooks';

interface KnobProps extends React.SVGProps<SVGElement> {
  id: string;
  controlId: ControlId;
}

const radius = 6.78;

// the perimeter of the ring
const CPerimeter = 2 * Math.PI * radius;

const StyledCircle = styled.circle<{ dashArray: number }>`
  stroke-dasharray: ${({ dashArray }) =>
      dashArray < CPerimeter ? dashArray : CPerimeter},
    100;
`;

const Knob: React.FunctionComponent<KnobProps> = ({ id, controlId, cx, cy }) => {
  const [yPosition, setYPosition] = React.useState(0);
  const [mouseDown, setMouseDown] = React.useState(false);
  const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }));
  const { toggleControl } = useToggleControl(controlId);

  const bind = useGesture({
    onDrag: ({ down, offset: [x, y] }) => {
      setYPosition(y);
      set({ x, y });
    },
    onMouseDown: () => {
      setMouseDown(true);
      toggleControl();
    },
    onMouseUp: () => {
      setMouseDown(false);
      toggleControl();
    }
  });

  return (
    <animated.g
      {...bind()}
      width={radius * 2}
      height={radius * 2}
      style={{ opacity: mouseDown ? 0.8 : 1 }}
      id={id}
    >
      <circle cx={cx} cy={cy} r='6.78' fill='#3C3C3B' />
      <circle
        cx={cx}
        cy={cy}
        r='6.78'
        fill='transparent'
        stroke='#d2d3d4'
        stroke-width='1'
      />
      <StyledCircle
        cx={cx}
        cy={cy}
        r='6.78'
        fill='transparent'
        stroke={Colors.Green}
        stroke-width='1'
        dashArray={
          yPosition < 0 ? Math.abs(yPosition * (CPerimeter * 0.03)) : 0
        }
      />
    </animated.g>
  );
};

const SvgRotaryButtons = (props: React.SVGProps<SVGSVGElement>) => {
  const buttons = Array(8).fill(1);

  let x = 90.45;
  const y = 14;
  const width = 6.78 * 2;

  return (
    <g id='rotary-buttons' fill='#3C3C3B' {...props}>
      <Knob id='tempo-knob' controlId={ControlId.TEMPO_KNOB} cx={y} cy={y} />
      <Knob
        id='swing-knob'
        controlId={ControlId.SWING_KNOB}
        cx={43.64}
        cy={14}
      />

      {buttons.map((b, index) => {
        if (index > 0) {
          x = x + width + 18.79;
        }

        return (
          <Knob id={`knob-${index + 1}`} controlId={71 + index} cx={x} cy={y} />
        );
      })}

      <Knob
        id='master-knob'
        controlId={ControlId.MASTER_OUTPUT_KNOB}
        cx={390.15}
        cy={14}
      />
    </g>
  );
};

export default SvgRotaryButtons;
