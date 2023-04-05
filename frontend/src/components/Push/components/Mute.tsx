import * as React from "react";
import { ControlId, ControlType } from "../../../libs/push2/controls";
import Control from "../Control";

const SvgMute = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <Control
      id="mute"
      name="mute"
      type={ControlType.CC}
      controlId={ControlId.MUTE}
    >
      <path
        id="Vector_187"
        d="M27.22 114.34H8.08v11.84h19.14v-11.84z"
        fill="#3C3C3B"
      />
      <path
        id="Vector_188"
        d="M10.31 119.67l.58-3 .95 2.16 1-2.16.52 3h-.43l-.27-1.67-.82 1.8L11 118l-.3 1.67h-.39z"
        fill="#fff"
      />
      <path
        id="Vector_189"
        d="M14.27 117.93v1c0 .29.11.43.34.43.23 0 .34-.14.34-.43v-1h.4v1a1 1 0 01-.05.36.662.662 0 01-.17.25.884.884 0 01-1 0 .823.823 0 01-.18-.25 1.058 1.058 0 01-.05-.36v-1h.37z"
        fill="#fff"
      />
      <path
        id="Vector_190"
        d="M16.28 118.3v1.37h-.4v-1.37h-.18v-.37h.18v-.64h.4v.64h.31v.37h-.31z"
        fill="#fff"
      />
      <path
        id="Vector_191"
        d="M18.49 118.89h-1.25a.56.56 0 00.14.35.434.434 0 00.32.12.411.411 0 00.25-.07.985.985 0 00.22-.26l.34.19a1.409 1.409 0 01-.17.23.904.904 0 01-.19.15.514.514 0 01-.21.1h-.26a.796.796 0 01-.62-.25.93.93 0 01-.24-.67 1 1 0 01.23-.67.788.788 0 01.61-.25.781.781 0 01.61.24 1 1 0 01.23.68l-.01.11zm-.41-.33a.39.39 0 00-.41-.32h-.14a.403.403 0 00-.11.07.285.285 0 00-.09.1.312.312 0 00-.06.13l.81.02z"
        fill="#fff"
      />
    </Control>
  );
};

export default SvgMute;
