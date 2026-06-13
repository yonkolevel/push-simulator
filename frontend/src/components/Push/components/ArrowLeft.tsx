import * as React from "react";
import { ControlId, ControlType } from "../../../libs/push2/controls";
import Control from "../Control";

const SvgArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <Control {...props} id="arrow-left" name="arrowleft" type={ControlType.CC} controlId={ControlId.ARROW_LEFT}>
    <path
      id="Vector_379"
      d="M373.39 115.15v39.79l14.07-14.07 5.83-5.83-19.9-19.89z"
      fill="#3C3C3B"
    />
    <path
      id="Vector_380"
      d="M381.68 141.27L376 135.6v.89l5.41-5.42a.621.621 0 10-.88-.88l-5.42 5.41a.652.652 0 000 .89l5.67 5.66a.621.621 0 10.88-.88h.02z"
      fill="#fff"
    />
  </Control>
);

export default SvgArrowLeft;
