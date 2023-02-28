import * as React from 'react';
import { Colors } from '../../../libs/push2/colors';
import { ControlId } from '../../../libs/push2/controls';
import { useToggleControl } from '../../../libs/push2/react/hooks';

const SvgDivision4ThTriplet = (props: React.SVGProps<SVGSVGElement>) => {
  const { isOn, toggleControl } = useToggleControl(ControlId.GRID_DIVISION_2);
  const [mouseDown, setMouseDown] = React.useState(false);

  return (
    <g
      id='division-4th'
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => {
        setMouseDown(false);
      }}
      style={{ opacity: mouseDown ? 0.8 : 1 }}
      onClick={toggleControl}
    >
      <path
        id='Vector_395'
        d='M345.37 304.23h20.19v-21.48h-20.19v21.48z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_396'
        d='M358.71 293.66l3 3v-.89l-3.38 3.39a.621.621 0 10.88.88l3.39-3.38a.642.642 0 000-.89l-3-3a.621.621 0 10-.88.88l-.01.01z'
        fill={isOn ? Colors.Green : '#fff'}
      />
    </g>
  );
};
export default SvgDivision4ThTriplet;
