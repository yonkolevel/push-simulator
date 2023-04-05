import * as React from "react";
import { ControlId, ControlType } from "../../../libs/push2/controls";
import Control from "../Control";

declare global {
  interface Window {
    backend: any;
    wails: any;
    runtime: any;
  }
}

const SvgPlay = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <Control
      name="play"
      id="play"
      type={ControlType.CC}
      controlId={ControlId.PLAY}
    >
      <path
        id="Vector_152"
        d="M28.27 305.23H8.08v20.53h20.19v-20.53z"
        fill="#3C3C3B"
      />
      <path
        id="Vector_153"
        d="M23.03 314.64l-8.82 5.42v-10.84l8.82 5.42z"
        stroke="#fff"
        strokeMiterlimit={10}
      />
    </Control>
  );
};

export default SvgPlay;
