import * as React from "react";
import { useEffect } from "react";
import { SendCCOn } from "../../../../wailsjs/go/push/AbletonPush";
import { ControlId } from "../../../libs/push2/controls";
import { useToggleControl } from "../../../libs/push2/react/hooks";
import { useMomentaRyPress } from "../../../libs/push2/react/hooks/ui";
import { ButtonColor } from "../../../libs/push2/types";

const SvgShift = (props: React.SVGProps<SVGSVGElement>) => {
  const ref = React.useRef<SVGGElement>(null);

  useMomentaRyPress(ref.current);

  const [mouseDown, setMouseDown] = React.useState(false);

  const { isOn, toggleControl } = useToggleControl(
    ControlId.SHIFT,
    "one-way",
    ButtonColor.WHITE
  );

  useEffect(() => {
    toggleControl();
  }, []);

  const handleMouseDown = React.useCallback(() => {
    setMouseDown(true);
    SendCCOn(ControlId.SHIFT);
  }, [window]);

  const handleMouseUp = React.useCallback(() => {
    setMouseDown(false);
    SendCCOn(ControlId.SHIFT);
  }, [window]);

  return (
    <g
      id="shift"
      ref={ref}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ opacity: mouseDown ? 0.8 : 1 }}
    >
      <path
        id="Vector_368"
        d="M393.31 327.96v-12.18h-20.19v12.18h20.19z"
        fill="#3C3C3B"
      />
      <path
        id="Vector_369"
        d="M376.21 318.51l-.34.2a.49.49 0 00-.44-.288.47.47 0 00-.26.078.354.354 0 00-.11.24c0 .14.1.25.3.33l.27.11c.191.073.362.189.5.34a.76.76 0 01.15.48.816.816 0 01-.25.63.87.87 0 01-.64.25.84.84 0 01-.59-.21 1.002 1.002 0 01-.29-.6l.42-.1c.003.12.037.237.1.34a.439.439 0 00.38.18.398.398 0 00.174-.03.463.463 0 00.246-.251.456.456 0 00.03-.179.627.627 0 000-.15.286.286 0 00-.07-.12.434.434 0 00-.12-.11l-.18-.09-.27-.11a.783.783 0 01-.57-.71.66.66 0 01.24-.52.868.868 0 01.59-.21.826.826 0 01.73.5z"
        fill="#fff"
      />
      <path
        id="Vector_370"
        d="M376.71 317.84h.41v1.43a.67.67 0 01.47-.19.58.58 0 01.47.19c.116.151.173.34.16.53v1.07h-.41v-1a.472.472 0 00-.07-.3.268.268 0 00-.24-.1.352.352 0 00-.3.13.877.877 0 00-.08.46v.84h-.41v-3.06z"
        fill="#fff"
      />
      <path
        id="Vector_371"
        d="M378.67 318.4a.247.247 0 01.07-.18.226.226 0 01.086-.061.232.232 0 01.104-.019.269.269 0 01.241.364.226.226 0 01-.061.086.247.247 0 01-.18.07.24.24 0 01-.26-.26zm.46.73v1.74h-.4v-1.74h.4z"
        fill="#fff"
      />
      <path
        id="Vector_372"
        d="M380.06 319.5v1.37h-.41v-1.37h-.14v-.37h.14v-.68a.718.718 0 01.12-.47.58.58 0 01.46-.19.667.667 0 01.27.07v.41a.453.453 0 00-.22-.07.141.141 0 00-.14.08.675.675 0 000 .29v.58h.44v.37l-.52-.02z"
        fill="#fff"
      />
      <path
        id="Vector_373"
        d="M381.28 319.5v1.37h-.4v-1.37h-.17v-.37h.17v-.65h.4v.65h.32v.37h-.32z"
        fill="#fff"
      />
    </g>
  );
};

export default SvgShift;
