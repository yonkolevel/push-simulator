import * as React from "react";
import { ControlId, ControlType } from "../../../libs/push2/controls";
import Control from "../Control";

const SvgNew = (props: React.SVGProps<SVGSVGElement>) => (
  <Control id="new" name="new" type={ControlType.CC} controlId={ControlId.NEW}>
    <path
      id="Vector_230"
      d="M28.18 220.93H7.99v20.19h20.19v-20.19z"
      fill="#3C3C3B"
    />
    <path
      id="Vector_231"
      d="M10.31 227v-3l2 2.11v-1.92h.42v2.94l-2-2.11V227h-.42z"
      fill="#fff"
    />
    <path
      id="Vector_232"
      d="M15 226.22h-1.29c.01.125.058.244.14.34.086.083.2.13.32.13a.389.389 0 00.25-.08.757.757 0 00.22-.26l.34.19c-.046.081-.1.158-.16.23a.992.992 0 01-.19.16.872.872 0 01-.22.09c-.083.01-.167.01-.25 0a.863.863 0 01-.63-.25 1 1 0 01-.24-.68 1 1 0 01.23-.67.797.797 0 01.62-.25.789.789 0 01.61.25c.152.189.23.427.22.67l.03.13zm-.42-.33a.38.38 0 00-.4-.33.33.33 0 00-.14 0 .236.236 0 00-.12.06.285.285 0 00-.09.1.35.35 0 00-.06.14l.81.03z"
      fill="#fff"
    />
    <path
      id="Vector_233"
      d="M15.57 225.25l.46 1 .49-1.16.5 1.16.45-1h.45l-.92 1.88-.48-1.13-.52 1.13-.91-1.88h.48z"
      fill="#fff"
    />
  </Control>
);

export default SvgNew;
