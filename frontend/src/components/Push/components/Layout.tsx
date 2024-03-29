import * as React from "react";
import { ControlId, ControlType } from "../../../libs/push2/controls";
import Control from "../Control";

const SvgLayout = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <Control
      id="layout"
      name="layout"
      type={ControlType.CC}
      controlId={ControlId.LAYOUT}
    >
      <path
        id="Vector_340"
        d="M414.12 245.81v-12.18h-20.19v12.18h20.19z"
        fill="#3C3C3B"
      />
      <path
        id="Vector_341"
        d="M395.92 235.93v2.37h.82v.4h-1.24v-2.77h.42z"
        fill="#fff"
      />
      <path
        id="Vector_342"
        d="M398.34 237h.41v1.75h-.41v-.19a.736.736 0 01-.53.24.763.763 0 01-.6-.27.942.942 0 01-.24-.66 1.003 1.003 0 01.24-.66.77.77 0 01.887-.193.716.716 0 01.243.183v-.2zm-.95.87a.63.63 0 00.13.41.455.455 0 00.35.16.484.484 0 00.198-.04.48.48 0 00.162-.12.59.59 0 00.14-.4.623.623 0 00-.14-.41.48.48 0 00-.162-.12.484.484 0 00-.39.003.493.493 0 00-.158.117.602.602 0 00-.13.35v.05z"
        fill="#fff"
      />
      <path
        id="Vector_343"
        d="M399.84 238.37l-.78-1.42h.47l.53 1 .5-1h.44l-1.4 2.7h-.46l.7-1.28z"
        fill="#fff"
      />
      <path
        id="Vector_344"
        d="M401.14 237.81a.841.841 0 01.27-.64.942.942 0 011.32 0 .93.93 0 010 1.31 1 1 0 01-1.33 0 .942.942 0 01-.26-.67zm.41 0a.6.6 0 00.14.41.504.504 0 00.38.16.48.48 0 00.38-.16.574.574 0 00.14-.4.6.6 0 00-.14-.41.524.524 0 00-.38-.161.538.538 0 00-.38.161.57.57 0 00-.14.41v-.01z"
        fill="#fff"
      />
      <path
        id="Vector_345"
        d="M403.83 237v1c0 .29.12.44.35.44.23 0 .34-.15.34-.44v-1h.4v1c.001.122-.016.243-.05.36a.591.591 0 01-.17.25.77.77 0 01-.52.18.748.748 0 01-.52-.18.537.537 0 01-.18-.25 1.07 1.07 0 01-.05-.36v-1h.4z"
        fill="#fff"
      />
      <path
        id="Vector_346"
        d="M405.85 237.33v1.37h-.41v-1.37h-.17V237h.17v-.64h.41v.64h.31v.38l-.31-.05z"
        fill="#fff"
      />
    </Control>
  );
};

export default SvgLayout;
