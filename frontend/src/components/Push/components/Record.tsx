import * as React from 'react';
import { ControlId } from '../../../libs/push2/controls';
import { useToggleControl } from '../../../libs/push2/react/hooks';
import { ButtonColor } from '../../../libs/push2/types';

const SvgRecord = (props: React.SVGProps<SVGSVGElement>) => {
  const { isOn, toggleControl } = useToggleControl(
    ControlId.RECORD,
    '2-ways',
    ButtonColor.RED
  );
  const [mouseDown, setMouseDown] = React.useState(false);
  return (
    <g id='record'>
      <path
        id='Vector_154'
        d='M28.18 282.85H7.99v19.07h20.19v-19.07z'
        fill='#3C3C3B'
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => {
          setMouseDown(false);
        }}
        style={{ opacity: mouseDown ? 0.8 : 1 }}
        onClick={toggleControl}
      />
      <path
        id='Vector_155'
        d='M18.21 297.19a4.73 4.73 0 100-9.46 4.73 4.73 0 000 9.46z'
        stroke={isOn ? 'red' : '#fff'}
        strokeMiterlimit={10}
      />
    </g>
  );
};

export default SvgRecord;
