import * as React from 'react';
import { Colors } from '../../../libs/push2/colors';
import { ControlId } from '../../../libs/push2/controls';
import { useToggleControl } from '../../../libs/push2/react/hooks';

const SvgDivision4Th = (props: React.SVGProps<SVGSVGElement>) => {
  const { isOn, toggleControl } = useToggleControl(ControlId.GRID_DIVISION_1);
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
        id='Vector_393'
        d='M345.06 327.81h20.19v-21.48h-20.19v21.48z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_394'
        d='M358.71 318.09l3 3v-.88l-3.38 3.38c-.57.57.31 1.46.88.89l3.39-3.39a.63.63 0 000-.88l-3-3c-.57-.57-1.45.32-.88.89l-.01-.01z'
        fill={isOn ? Colors.Green : '#fff'}
      />
    </g>
  );
};

export default SvgDivision4Th;
