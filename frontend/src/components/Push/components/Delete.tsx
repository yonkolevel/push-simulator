import * as React from "react";
import { Colors, pushColorToHexMap } from "../../../libs/push2/colors";
import {
  padDown,
  padUp,
  useAppDispatch,
  useAppState
} from "../../../libs/push2/context/PushContext";
import { ControlId, controls, ControlType } from "../../../libs/push2/controls";
import Control from "../Control";

const SvgDelete = (props: React.SVGProps<SVGSVGElement>) => {
  const { controlsState } = useAppState();
  const controlState = controlsState.get(ControlId.DELETE);
  const color = pushColorToHexMap[controlState?.velocity || 0];

  return (
    <Control name="Delete" controlId={ControlId.DELETE} type={ControlType.CC}>
      <path id="Vector_175" d="M28.27 58.33H8.08v20.19h20.19V58.33z" />
      <path
        id="Vector_176"
        d="M10.31 63.66v-2.77h.58a2.27 2.27 0 01.66.08c.174.06.334.155.47.28a1.43 1.43 0 010 2.06 1.25 1.25 0 01-.47.27 2.15 2.15 0 01-.65.08h-.59zm.42-.39h.18a1.53 1.53 0 00.47-.06.9.9 0 00.34-.2 1 1 0 000-1.47 1.14 1.14 0 00-.81-.26h-.18v1.99z"
        fill={color}
      />
      <path
        id="Vector_177"
        d="M14.49 62.88h-1.25a.51.51 0 00.14.34.47.47 0 00.57.06c.084-.08.158-.171.22-.27l.34.19a1.058 1.058 0 01-.17.23.7.7 0 01-.19.16.781.781 0 01-.21.09c-.086.01-.174.01-.26 0a.819.819 0 01-.63-.25 1 1 0 01-.23-.67.93.93 0 01.23-.67.79.79 0 01.61-.26.8.8 0 01.61.25 1 1 0 01.22.68v.12zm-.41-.33a.39.39 0 00-.41-.32h-.14l-.12.07a.449.449 0 00-.09.1.5.5 0 00-.05.13l.81.02z"
        fill={color}
      />
      <path id="Vector_178" d="M15.34 60.63v3h-.41v-3h.41z" fill={color} />
      <path
        id="Vector_179"
        d="M17.44 62.88h-1.25a.46.46 0 00.14.34.41.41 0 00.32.13.36.36 0 00.24-.07 1.12 1.12 0 00.23-.27l.34.19c-.05.082-.106.159-.17.23a.7.7 0 01-.19.16.846.846 0 01-.22.09.996.996 0 01-.25 0 .819.819 0 01-.63-.25 1.09 1.09 0 010-1.34.77.77 0 01.61-.26.8.8 0 01.61.25 1 1 0 01.22.68v.12zm-.44-.33a.4.4 0 00-.41-.32h-.14l-.12.07a.449.449 0 00-.09.1l-.06.13.82.02z"
        fill={color}
      />
      <path
        id="Vector_180"
        d="M18.33 62.29v1.37h-.4v-1.37h-.18v-.38h.18v-.64h.4v.64h.31v.38h-.31z"
        fill={color}
      />
      <path
        id="Vector_181"
        d="M20.54 62.88h-1.25a.51.51 0 00.14.34.47.47 0 00.57.06 1.13 1.13 0 00.22-.27l.34.19a1.058 1.058 0 01-.17.23.7.7 0 01-.19.16.781.781 0 01-.21.09c-.086.01-.174.01-.26 0a.79.79 0 01-.62-.25.93.93 0 01-.24-.67 1 1 0 01.23-.67.79.79 0 01.61-.26.799.799 0 01.61.25 1 1 0 01.22.68v.12zm-.41-.33a.39.39 0 00-.41-.32h-.14a.41.41 0 00-.11.07.32.32 0 00-.1.1.497.497 0 00-.05.13l.81.02z"
        fill={color}
      />
    </Control>
  );
};

export default SvgDelete;
