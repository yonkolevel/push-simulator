import * as React from "react";
import { ControlId, ControlType } from "../../../libs/push2/controls";
import Control from "../Control";

const SvgNote = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <Control
      id="note"
      name="note"
      type={ControlType.CC}
      controlId={ControlId.NOTE}
    >
      <path
        id="Vector_347"
        d="M393.31 245.82v-12.18h-20.19v12.18h20.19z"
        fill="#3C3C3B"
      />
      <path
        id="Vector_348"
        d="M393.31 265.33v-20.19h-20.19v20.19h20.19z"
        fill="#3C3C3B"
      />
      <path
        id="Vector_349"
        d="M374.51 250.78v-3l2 2.11V248h.49v3l-2-2.11v1.94l-.49-.05z"
        fill="#fff"
      />
      <path
        id="Vector_350"
        d="M377.48 249.89a.841.841 0 01.27-.64.942.942 0 011.32 0 .93.93 0 01-.307 1.514.923.923 0 01-.363.066.913.913 0 01-.92-.94zm.41 0a.6.6 0 00.14.41.501.501 0 00.38.16.51.51 0 00.38-.16.574.574 0 00.14-.4.6.6 0 00-.14-.41.516.516 0 00-.174-.118.52.52 0 00-.206-.042.51.51 0 00-.38.16.57.57 0 00-.14.41v-.01z"
        fill="#fff"
      />
      <path
        id="Vector_351"
        d="M380.21 249.41v1.37h-.41v-1.37h-.17V249h.17v-.64h.41v.64h.31v.38l-.31.03z"
        fill="#fff"
      />
      <path
        id="Vector_352"
        d="M382.42 250h-1.25a.483.483 0 00.281.437.41.41 0 00.169.033.39.39 0 00.25-.08.755.755 0 00.22-.26l.34.19a.988.988 0 01-.35.39.878.878 0 01-.22.09c-.083.01-.167.01-.25 0a.868.868 0 01-.63-.25 1 1 0 01-.24-.68.998.998 0 01.23-.67.797.797 0 01.62-.25.787.787 0 01.61.25.934.934 0 01.22.67v.13zm-.42-.33a.38.38 0 00-.4-.33.33.33 0 00-.14 0l-.12.06-.09.1a.597.597 0 00-.06.14l.81.03z"
        fill="#fff"
      />
    </Control>
  );
};

export default SvgNote;
