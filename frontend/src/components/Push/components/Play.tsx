import * as React from 'react';
import { Colors } from '../../../libs/push2/colors';
import { ControlId } from '../../../libs/push2/controls';
import { useDeviceNoteState, useToggleControl } from '../../../libs/push2/react/hooks';
import { ButtonColor } from '../../../libs/push2/types';

declare global {
  interface Window {
    backend: any;
    wails: any;
    runtime: any
  }
}

const SvgPlay = (props: React.SVGProps<SVGSVGElement>) => {
  const {  toggleControl } = useToggleControl(
    ControlId.PLAY,
    '2-ways',
    ButtonColor.GREEN
  );
  const {notesState} = useDeviceNoteState()
  const [mouseDown, setMouseDown] = React.useState(false);
const controlState = notesState.get(ControlId.PLAY)

  return (
    <g
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => {
        setMouseDown(false);
      }}
      style={{ opacity: mouseDown ? 0.8 : 1 }}
      id='play'
      onClick={toggleControl}
    >
      <path
        id='Vector_152'
        d='M28.27 305.23H8.08v20.53h20.19v-20.53z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_153'
        d='M23.03 314.64l-8.82 5.42v-10.84l8.82 5.42z'
        stroke={controlState?.isOn ? Colors.Green : '#fff'}
        strokeMiterlimit={10}
      />
    </g>
  );
};

export default SvgPlay;
