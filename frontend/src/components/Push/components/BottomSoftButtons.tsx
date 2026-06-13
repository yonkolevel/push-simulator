import * as React from 'react';
import { Colors } from '../../../libs/push2/colors';
import { useAppState } from '../../../libs/push2/context/PushContext';
import { ControlId, ControlType } from '../../../libs/push2/controls';
import Control from '../Control';

const width = 29.23;
const height = 11.76;

interface SoftButtonProps {
  controlId: number;
  xPosition: number;
}

const SoftButton: React.FunctionComponent<SoftButtonProps> = ({
  xPosition,
  controlId,
  ...props
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
      <svg
        x={xPosition}
        width={width}
        height={height}
        id={`soft-button-${controlId}`}
        {...props}
      >
        <rect width={width} height={height} fill="#3C3C3B" />
        <svg x="6%" y="6%">
          <rect height={1} width={25.8} fill={isOn ? Colors.Green : '#fff'} />
        </svg>
      </svg>
    </Control>
  );
};

const BottomSoftButtons: React.FunctionComponent = () => {
  const buttons = Array(8).fill(1);
  let x = 0;
  const startSoftButton = 20;

  return (
    <svg
      x={76}
      y={113.63}
      width={255.54}
      height={height}
      id="bottom-soft-buttons"
    >
      {buttons.map((_, index) => {
        if (index > 0) {
          x = x + width + 3.13;
        }

        return (
          <SoftButton
            key={startSoftButton + index}
            xPosition={x}
            controlId={startSoftButton + index}
          />
        );
      })}
    </svg>
  );
};

export default BottomSoftButtons;
