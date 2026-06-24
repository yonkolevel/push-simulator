import * as React from "react";
import { ControlId, ControlType } from "../../../libs/push2/controls";
import Control from "../Control";

const SvgScale = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <Control
      {...props}
      id="scale"
      name="scale"
      type={ControlType.CC}
      controlId={ControlId.SCALE}
    >
      <path
        id="Vector_scale_bg"
        d="M393.31 245.82v-12.18h-20.19v12.18h20.19z"
        fill="#3C3C3B"
      />
      <text
        x="374.65"
        y="239.65"
        fill="#fff"
        fontSize="3.2"
        fontFamily="Nunito, Arial, sans-serif"
        pointerEvents="none"
      >
        Scale
      </text>
    </Control>
  );
};

export default SvgScale;
