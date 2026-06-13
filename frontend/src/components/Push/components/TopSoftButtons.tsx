import * as React from 'react';
import { Colors } from '../../../libs/push2/colors';
import { useAppState } from '../../../libs/push2/context/PushContext';
import { ControlId, ControlType } from '../../../libs/push2/controls';
import Control from '../Control';

const width = 29.23;

interface SoftButtonProps {
  controlId: number;
  xPosition: number;
}

const SoftButton: React.FunctionComponent<SoftButtonProps> = ({
  xPosition,
  controlId,
}) => {
  const { controlsState } = useAppState();
  const controllerState = controlsState.get(controlId);
  const isOn = Boolean(controllerState?.velocity);

  return (
    <Control
      controlId={controlId as ControlId}
      name={`soft-button-${controlId}`}
      type={ControlType.CC}
    >
      <svg x={xPosition} id={`soft-button-${controlId}`}>
        <path
          id={`soft-button-${controlId}-body`}
          d="M105.84 33.35H76.61v11.76h29.23V33.35z"
          fill="#3C3C3B"
        />
        <path
          id={`soft-button-${controlId}-led`}
          d="M103.37 43.23H79.09a.45.45 0 00-.45.45v.04c0 .248.201.45.45.45h24.28a.45.45 0 00.45-.45v-.04a.45.45 0 00-.45-.45z"
          fill={isOn ? Colors.Green : '#fff'}
        />
      </svg>
    </Control>
  );
};

const TopSoftButtons: React.FunctionComponent = () => {
  const buttons = Array(8).fill(1);
  let x = 0;
  const startSoftButton = 102;

  return (
    <g id="top-soft-buttons">
      {buttons.map((_, index) => {
        if (index > 0) {
          x = x + width + 3.13;
        }

        const controlId = startSoftButton + index;
        return (
          <SoftButton
            key={controlId}
            xPosition={x}
            controlId={controlId}
          />
        );
      })}
    </g>
  );
};

export default TopSoftButtons;
