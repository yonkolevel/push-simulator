import * as React from 'react';
import { Colors } from '../../../libs/push2/colors';
import { ControlId } from '../../../libs/push2/controls';
import { useToggleControl } from '../../../libs/push2/react/hooks';

const SvgDivision16Th = (props: React.SVGProps<SVGSVGElement>) => {
  const { isOn, toggleControl } = useToggleControl(ControlId.GRID_DIVISION_3);
  const [mouseDown, setMouseDown] = React.useState(false);

  return (
    <g
      id='division-8th'
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => {
        setMouseDown(false);
      }}
      style={{ opacity: mouseDown ? 0.8 : 1 }}
      onClick={toggleControl}
    >
      <path
        id='Vector_401'
        d='M344.74 230.61h20.19v-21.48h-20.19v21.48z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_402'
        d='M358.71 221l3 3v-.88l-3.38 3.38a.621.621 0 10.88.88l3.39-3.38a.63.63 0 000-.88l-3-3a.621.621 0 10-.88.88h-.01z'
        fill={isOn ? Colors.Green : '#fff'}
      />
    </g>
  );
};

export default SvgDivision16Th;
