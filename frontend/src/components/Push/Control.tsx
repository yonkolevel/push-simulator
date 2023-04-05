import * as React from "react";
import { Colors } from "../../libs/push2/colors";
import {
  ccDown,
  ccUp,
  padDown,
  padUp,
  useAppDispatch,
  useAppState
} from "../../libs/push2/context/PushContext";
import { ControlId, controls, ControlType } from "../../libs/push2/controls";
import { Mode } from "../../libs/push2/core";

interface IControlProps extends React.SVGProps<SVGSVGElement> {
  controlId: ControlId;
  name: string | undefined;
  type: ControlType;
  color?: string;
}

const Control: React.FunctionComponent<IControlProps> = ({
  controlId,
  children,
  name,
  type,
  color
}) => {
  const { tapMode, notesPressed, controlsPressed } = useAppState();
  const dispatch = useAppDispatch();
  var isTapped = false;

  if (type == ControlType.CC) {
    isTapped = controlsPressed.has(controlId);
  } else {
    isTapped = notesPressed.has(controlId);
  }

  const tap = type == ControlType.CC ? ccDown : padDown;
  const release = type === ControlType.CC ? ccUp : padUp;

  return (
    <g
      id={name}
      onMouseLeave={() => {
        if (tapMode === Mode.MultiTap) {
          return;
        }

        if (isTapped) {
          release(dispatch, controlId);
        }
      }}
      onMouseDown={() => {
        tap(dispatch, controlId);
      }}
      onMouseUp={() => {
        if (tapMode === Mode.MultiTap) {
          return;
        }

        release(dispatch, controlId);
      }}
      fill={color || "#3C3C3B"}
      style={{ opacity: isTapped ? 0.8 : 1 }}
    >
      {children}
    </g>
  );
};

export default Control;
