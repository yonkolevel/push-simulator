import * as React from 'react';
import { Colors } from '../../../libs/push2/colors';
import { ControlId } from '../../../libs/push2/controls';
import { useToggleControl } from '../../../libs/push2/react/hooks';

const SvgOctaveDown = (props: React.SVGProps<SVGSVGElement>) => {
  const { isOn, toggleControl } = useToggleControl(ControlId.OCTAVE_DOWN);
  const [mouseDown, setMouseDown] = React.useState(false);

  return (
    <g
      id='octave-down'
      onMouseDown={() => {
        setMouseDown(true);
        toggleControl();
      }}
      onMouseUp={() => {
        setMouseDown(false);
        toggleControl();
      }}
      style={{ opacity: mouseDown ? 0.8 : 1 }}
    >
      <path
        id='Vector_389'
        d='M373.91 310.78h39.79l-14.07-14.07-5.82-5.82-5.83 5.82-14.07 14.07z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_390'
        d='M396.11 296l-3.32 3.32h.88l-3.16-3.16a.621.621 0 10-.88.88l3.16 3.17a.652.652 0 00.88 0l3.33-3.33c.57-.57-.32-1.45-.89-.88z'
        fill={isOn ? Colors.Green : '#fff'}
      />
    </g>
  );
};

export default SvgOctaveDown;
