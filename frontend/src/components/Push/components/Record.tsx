import * as React from "react";
import { pushColorToHexMap } from "../../../libs/push2/colors";
import { useAppState } from "../../../libs/push2/context/PushContext";
import { ControlId, ControlType } from "../../../libs/push2/controls";
import { useToggleControl } from "../../../libs/push2/react/hooks";
import { ButtonColor } from "../../../libs/push2/types";
import Control from "../Control";

const SvgRecord = (props: React.SVGProps<SVGSVGElement>) => {
  const { controlsState } = useAppState();
  const controlState = controlsState.get(ControlId.DELETE);
  const color = pushColorToHexMap[controlState?.velocity || 0];

  return (
    <Control
      id="new"
      name="new"
      type={ControlType.CC}
      controlId={ControlId.RECORD}
    >
      <path
        id="Vector_154"
        d="M28.18 282.85H7.99v19.07h20.19v-19.07z"
        fill="#3C3C3B"
      />
      <path
        id="Vector_155"
        d="M18.21 297.19a4.73 4.73 0 100-9.46 4.73 4.73 0 000 9.46z"
        stroke={controlState?.velocity ? "red" : "#fff"}
        strokeMiterlimit={10}
      />
    </Control>
  );
};

export default SvgRecord;
