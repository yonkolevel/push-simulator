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
}

const Control: React.FunctionComponent<IControlProps> = ({
  controlId,
  children,
  name,
  type
}) => {
  const [mouseDown, setMouseDown] = React.useState(false);
  const { notesPressed, tapMode } = useAppState();
  const dispatch = useAppDispatch();
  const isOn = notesPressed.has(ControlId.DELETE);

  const tap = type == ControlType.CC ? ccDown : padDown;
  const release = type === ControlType.CC ? ccUp : padUp;

  return (
    <g
      id={name}
      onMouseLeave={() => {
        if (tapMode != Mode.MultiTap) {
          release(dispatch, controlId);
        }
      }}
      onMouseDown={() => {
        setMouseDown(true);
        tap(dispatch, controlId);
      }}
      onMouseUp={() => {
        setMouseDown(false);
        release(dispatch, controlId);
      }}
      fill={"#3C3C3B"}
      style={{ opacity: mouseDown ? 0.8 : 1 }}
    >
      {children}
    </g>
  );
};

export default Control;
