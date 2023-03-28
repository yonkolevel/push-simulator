import * as React from "react";
import { Colors } from "../../../libs/push2/colors";
import {
  padDown,
  padUp,
  useAppDispatch,
  useAppState
} from "../../../libs/push2/context/PushContext";
import { useToggleControl } from "../../../libs/push2/react/hooks";

interface IBottomSoftButtonsProps {}

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
  const { notesPressed } = useAppState();
  const [mouseDown, setMouseDown] = React.useState(false);
  const dispatch = useAppDispatch();
  const isOn = notesPressed.has(controlId);

  return (
    <svg
      x={xPosition}
      width={width}
      height={height}
      id="soft-button-1"
      {...props}
      onMouseDown={() => {
        setMouseDown(true);
        padDown(dispatch, controlId);
      }}
      onMouseUp={() => {
        setMouseDown(false);
        padUp(dispatch, controlId);
      }}
      style={{ opacity: mouseDown ? 0.8 : 1 }}
    >
      <rect width={width} height={height} fill="#3C3C3B" />
      <svg x="6%" y="6%">
        <rect height={1} width={25.8} fill={isOn ? Colors.Green : "#9D9D9C"} />
      </svg>
    </svg>
  );
};

const BottomSoftButtons: React.FunctionComponent<IBottomSoftButtonsProps> = (
  props
) => {
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
      {buttons.map((b, index) => {
        if (index > 0) {
          x = x + width + 3.13;
        }

        return <SoftButton key={index} xPosition={x} controlId={startSoftButton + index} />;
      })}
    </svg>
  );
};

export default BottomSoftButtons;
