import * as React from 'react';
import { ControlId, ControlType } from '../../../libs/push2/controls';
import Control from '../Control';
import {
  ccDown,
  useAppDispatch,
  useAppState,
} from '../../../libs/push2/context/PushContext';
import { Colors } from '../../../libs/push2/colors';

declare global {
  interface Window {
    backend: any;
    wails: any;
    runtime: any;
  }
}

const SvgPlay = (props: React.SVGProps<SVGSVGElement>) => {
  const { tapMode, notesPressed, controlsPressed, controlsState } =
    useAppState();
  const dispatch = useAppDispatch();

  var isOn = false;

  const controllerState = controlsState.get(ControlId.PLAY);
  if (controllerState && controllerState.velocity > 0) {
    isOn = true;
  } else {
    isOn = false;
  }

  return (
    <Control
      name='play'
      id='play'
      type={ControlType.CC}
      controlId={ControlId.PLAY}
      onClick={() => {
        ccDown(dispatch, ControlId.PLAY);
      }}
    >
      <path
        id='Vector_152'
        d='M28.27 305.23H8.08v20.53h20.19v-20.53z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_153'
        d='M23.03 314.64l-8.82 5.42v-10.84l8.82 5.42z'
        stroke={isOn ? Colors.Green : '#fff'}
        strokeMiterlimit={10}
      />
    </Control>
  );
};

export default SvgPlay;
