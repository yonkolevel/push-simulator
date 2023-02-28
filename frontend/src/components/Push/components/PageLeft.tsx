import * as React from 'react';
import { Colors } from '../../../libs/push2/colors';
import { ControlId } from '../../../libs/push2/controls';
import { useToggleControl } from '../../../libs/push2/react/hooks';

const SvgPageLeft = (props: React.SVGProps<SVGSVGElement>) => {
  const { isOn, toggleControl } = useToggleControl(ControlId.PAGE_LEFT);
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
        // style={{ opacity: mouseDown ? 0.8 : 1 }}

        id='Vector_387'
        d='M373.39 270.48v39.78l14.07-14.07 5.83-5.82-19.9-19.89z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_388'
        d='M388 293.56l-2.89-2.9v.89l2.76-2.76c.57-.57-.32-1.46-.88-.89l-2.77 2.76a.652.652 0 000 .89l2.89 2.89c.57.57 1.46-.32.89-.88z'
        fill={isOn ? Colors.Green : '#fff'}
      />
    </g>
  );
};

export default SvgPageLeft;
