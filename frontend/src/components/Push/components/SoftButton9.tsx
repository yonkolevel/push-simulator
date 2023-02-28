import * as React from "react";
import { SendCC } from '../../../../wailsjs/go/push/AbletonPush';
import { ControlId } from "../../../libs/push2/controls";
import { useToggleControl } from "../../../libs/push2/react/hooks";

const SvgSoftButton9 = (props: React.SVGProps<SVGSVGElement>) => {
  const { toggleControl, isOn } = useToggleControl(ControlId.SB10);
  const [mouseDown, setMouseDown] = React.useState(false);

  return (
    <g
      id="soft-button-9"
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => {
        setMouseDown(false);
      }}
      style={{ opacity: mouseDown ? 0.8 : 1 }}
      onClick={() => {

        SendCC(ControlId.SB10, 0).then((err: any) => {
          console.log(err);
        });
      }}
    >
      <path
        id="Vector_417"
        d="M105.84 33.35H76.61v11.76h29.23V33.35z"
        fill="#3C3C3B"
      />
      <path
        id="Vector_418"
        d="M103.37 43.23H79.09a.45.45 0 00-.45.45v.04c0 .248.201.45.45.45h24.28a.45.45 0 00.45-.45v-.04a.45.45 0 00-.45-.45z"
        fill="#9D9D9C"
      />
    </g>
  );
};

export default SvgSoftButton9;
