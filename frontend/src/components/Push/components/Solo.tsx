import * as React from "react";
import { pushColorToHexMap } from "../../../libs/push2/colors";
import { useAppState } from "../../../libs/push2/context/PushContext";
import { ControlId, ControlType } from "../../../libs/push2/controls";
import Control from "../Control";

const SvgSolo = (props: React.SVGProps<SVGSVGElement>) => {
  const { controlsState } = useAppState();
  const controlState = controlsState.get(ControlId.DELETE);
  const color = pushColorToHexMap[controlState?.velocity || 0];

  return (
    <Control
      id="solo"
      name="solo"
      type={ControlType.CC}
      controlId={ControlId.SOLO}
    >
      <path
        id="Vector_257"
        d="M46.98 114.34H27.84v11.84h19.14v-11.84z"
        fill="#3C3C3B"
      />
      <path
        id="Vector_258"
        d="M31 117.37l-.33.2a.62.62 0 00-.19-.22.397.397 0 00-.23-.06.483.483 0 00-.29.1.34.34 0 00-.11.25c0 .13.1.24.3.32l.28.12c.189.066.358.18.49.33a.77.77 0 01.16.48.833.833 0 01-.26.63.91.91 0 01-1.23 0 1 1 0 01-.29-.6l.42-.09a.8.8 0 00.1.33.443.443 0 00.38.18.454.454 0 00.179-.03.456.456 0 00.151-.1.48.48 0 00.12-.33.39.39 0 000-.15.368.368 0 00-.07-.12.616.616 0 00-.12-.11l-.18-.09-.27-.11a.783.783 0 01-.57-.71.67.67 0 01.24-.52.883.883 0 01.6-.21.827.827 0 01.72.51z"
        fill="#fff"
      />
      <path
        id="Vector_259"
        d="M31.4 118.84a.85.85 0 01.27-.64.887.887 0 01.66-.27.954.954 0 01.67.27.928.928 0 01.274.655.919.919 0 01-.274.655.887.887 0 01-.66.27.881.881 0 01-.66-.27.895.895 0 01-.28-.67zm.41 0a.6.6 0 00.14.41.523.523 0 00.38.16.492.492 0 00.38-.16.532.532 0 00.14-.4.55.55 0 00-.14-.41.508.508 0 00-.38-.16.501.501 0 00-.37.16.544.544 0 00-.15.41v-.01z"
        fill="#fff"
      />
      <path id="Vector_260" d="M34.1 116.69v3h-.41v-3h.41z" fill="#fff" />
      <path
        id="Vector_261"
        d="M34.53 118.84a.85.85 0 01.27-.64.942.942 0 011.32 0 .93.93 0 01-.307 1.514.918.918 0 01-.363.066.917.917 0 01-.66-.273.917.917 0 01-.26-.667zm.41 0a.55.55 0 00.14.41.508.508 0 00.38.16.523.523 0 00.38-.16.57.57 0 00.14-.4.6.6 0 00-.14-.41.523.523 0 00-.38-.16.507.507 0 00-.38.16.57.57 0 00-.14.41v-.01z"
        fill="#fff"
      />
    </Control>
  );
};

export default SvgSolo;
