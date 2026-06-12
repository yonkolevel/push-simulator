import * as React from 'react';
import {
  ccDown,
  ccUp,
  useAppDispatch,
  useAppState,
} from '../../../libs/push2/context/PushContext';
import { ControlId, ControlType } from '../../../libs/push2/controls';
import Control from '../Control';
import { Colors } from '../../../libs/push2/colors';

interface IBottomSoftButtonsProps {}

const width = 29.23;

interface SoftButtonProps {
  controlId: number;
  xPosition: number;
}

const SoftButton: React.FunctionComponent<SoftButtonProps> = ({
  xPosition,
  controlId,
  ...props
}) => {
  const { notesPressed, controlsState } = useAppState();
  const [mouseDown, setMouseDown] = React.useState(false);
  const dispatch = useAppDispatch();

  var isOn = false;

  const controllerState = controlsState.get(controlId);
  if (controllerState && controllerState.velocity > 0) {
    isOn = true;
  } else {
    isOn = false;
  }

  return (
    <Control
      controlId={controlId}
      name={controlId.toString()}
      type={ControlType.CC}
    >
      <svg
        x={xPosition}
        id='soft-button-9'
        onMouseDown={() => {
          setMouseDown(true);
          ccDown(dispatch, controlId);
        }}
        onMouseUp={() => {
          setMouseDown(false);
          ccUp(dispatch, controlId);
        }}
        style={{ opacity: mouseDown ? 0.8 : 1 }}
      >
        <path
          id='Vector_417'
          d='M105.84 33.35H76.61v11.76h29.23V33.35z'
          fill='#3C3C3B'
        />
        <path
          id='Vector_418'
          d='M103.37 43.23H79.09a.45.45 0 00-.45.45v.04c0 .248.201.45.45.45h24.28a.45.45 0 00.45-.45v-.04a.45.45 0 00-.45-.45z'
          fill={isOn ? Colors.Green : '#fff'}
        />
      </svg>
    </Control>
  );
};

const TopSoftButtons: React.FunctionComponent<IBottomSoftButtonsProps> = (
  props
) => {
  const buttons = Array(8).fill(1);
  let x = 0;
  const startSoftButton = 102;

  return (
    <g>
      {buttons.map((_, index) => {
        if (index > 0) {
          x = x + width + 3.13;
        }

        return <SoftButton xPosition={x} controlId={startSoftButton + index} />;
      })}
    </g>
  );
};

export default TopSoftButtons;
