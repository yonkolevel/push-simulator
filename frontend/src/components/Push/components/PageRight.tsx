import * as React from 'react';
import { Colors } from '../../../libs/push2/colors';
import { ControlId } from '../../../libs/push2/controls';
import { useToggleControl } from '../../../libs/push2/react/hooks';

const SvgPageRight = (props: React.SVGProps<SVGSVGElement>) => {
  const { isOn, toggleControl } = useToggleControl(ControlId.PAGE_RIGHT);

  const [mouseDown, setMouseDown] = React.useState(false);
  return (
    <g
      id='page-left'
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
        id='Vector_391'
        d='M414.22 310.26v-39.78l-19.9 19.89 5.83 5.82 14.07 14.07z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_392'
        d='M398.9 288.11l3 3v-.88l-3.38 3.38c-.57.57.31 1.46.88.89l3.39-3.39a.63.63 0 000-.88l-3-3c-.57-.57-1.45.32-.88.89l-.01-.01z'
        fill={isOn ? Colors.Green : '#fff'}
      />
    </g>
  );
};

export default SvgPageRight;
