import * as React from "react";
import { Colors } from "../../libs/push2/colors";
import {
  padDown,
  padUp,
  useAppDispatch,
  useAppState
} from "../../libs/push2/context/PushContext";
import { ControlId, controls } from "../../libs/push2/controls";

interface IControlProps extends React.SVGProps<SVGSVGElement> {
  controlId: ControlId;
  name: string | undefined;
}

const Control: React.FunctionComponent<IControlProps> = ({
  controlId,
  children,
  name
}) => {
  const [mouseDown, setMouseDown] = React.useState(false);
  const { notesPressed } = useAppState();
  const dispatch = useAppDispatch();
  const isOn = notesPressed.has(ControlId.DELETE);

  return (
    <g
      id={name}
      onMouseDown={() => {
        setMouseDown(true);
        padDown(dispatch, ControlId.DELETE);
      }}
      onMouseUp={() => {
        setMouseDown(false);
        padUp(dispatch, ControlId.DELETE);
      }}
      fill={"#3C3C3B"}
      style={{ opacity: mouseDown ? 0.8 : 1 }}
    >
      {children}
    </g>
  );
};

export default Control;
