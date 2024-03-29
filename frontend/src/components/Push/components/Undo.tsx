import * as React from "react";
import { pushColorToHexMap } from "../../../libs/push2/colors";
import { useAppState } from "../../../libs/push2/context/PushContext";
import { ControlId, ControlType } from "../../../libs/push2/controls";
import Control from "../Control";

const SvgUndo = (props: React.SVGProps<SVGSVGElement>) => {
  const { controlsState } = useAppState();
  const controlState = controlsState.get(ControlId.DELETE);

  return (
    <Control
      id="undo"
      name="undo"
      type={ControlType.CC}
      controlId={ControlId.UNDO}
    >
      <path
        id="Vector_182"
        d="M28.27 79.15H8.08v20.19h20.19V79.15z"
        fill="#3C3C3B"
      />
      <path
        id="Vector_183"
        d="M10.73 82.35V84a1 1 0 00.11.52.58.58 0 00.49.24.56.56 0 00.49-.24.89.89 0 00.12-.52v-1.67h.42v1.78a1.001 1.001 0 01-.615.962.999.999 0 01-.415.078 1 1 0 01-1-1v-1.78l.4-.02z"
        fill="#fff"
      />
      <path
        id="Vector_184"
        d="M13 83.37h.41v.16a.66.66 0 01.47-.21.62.62 0 01.48.19.79.79 0 01.15.54v1.07h-.41v-1a.59.59 0 00-.07-.35.28.28 0 00-.25-.1.31.31 0 00-.29.13.88.88 0 00-.08.46v.84H13v-1.73z"
        fill="#fff"
      />
      <path
        id="Vector_185"
        d="M16.28 82.09h.4v3h-.4v-.18a.78.78 0 01-.868.165.79.79 0 01-.272-.195 1 1 0 01-.24-.67.92.92 0 01.24-.65.74.74 0 01.59-.27.8.8 0 01.55.25v-1.45zm-1 2.15a.61.61 0 00.13.41.43.43 0 00.35.16.44.44 0 00.36-.16.59.59 0 00.14-.4.62.62 0 00-.14-.41.459.459 0 00-.36-.15.43.43 0 00-.34.15.56.56 0 00-.1.4h-.04z"
        fill="#fff"
      />
      <path
        id="Vector_186"
        d="M17.11 84.23a.85.85 0 01.27-.64.934.934 0 011.32 1.32.94.94 0 01-.67.26.901.901 0 01-.66-.27.94.94 0 01-.26-.67zm.41 0a.6.6 0 00.14.41.481.481 0 00.38.16.5.5 0 00.38-.15.62.62 0 00.14-.41.6.6 0 00-.14-.41.501.501 0 00-.38-.15.52.52 0 00-.38.15.59.59 0 00-.14.41v-.01z"
        fill="#fff"
      />
    </Control>
  );
};

export default SvgUndo;
