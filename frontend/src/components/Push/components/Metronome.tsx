import * as React from "react";
import { ControlId } from "../../../libs/push2/controls";
import { useToggleControl } from "../../../libs/push2/react/hooks";
import { useMomentaRyPress } from "../../../libs/push2/react/hooks/ui";
import { ButtonColor } from "../../../libs/push2/types";
import { SendCCOff, SendCCOn } from "../../../../wailsjs/go/push/AbletonPush";

const SvgMetronome = (props: React.SVGProps<SVGSVGElement>) => {
  const ref = React.useRef<SVGGElement>(null);

  useMomentaRyPress(ref.current);

  const [mouseDown, setMouseDown] = React.useState(false);

  const { isOn, toggleControl } = useToggleControl(
    ControlId.METRO_NOME,
    "one-way",
    ButtonColor.WHITE
  );

  React.useEffect(() => {
    toggleControl();
  }, []);

  const handleMouseDown = React.useCallback(() => {
    setMouseDown(true);
    SendCCOn(ControlId.METRO_NOME);
  }, [window]);

  const handleMouseUp = React.useCallback(() => {
    setMouseDown(false);
    SendCCOff(ControlId.METRO_NOME);
  }, [window]);

  return (
    <g
      id="metronome"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ opacity: mouseDown ? 0.8 : 1 }}
    >
      <path
        id="Vector_165"
        d="M64.98 33.69H36.84v11.64h28.14V33.69z"
        fill="#3C3C3B"
      />
      <path
        id="Vector_166"
        d="M39.06 38.34l.58-3 1 2.15 1-2.15.52 3h-.42l-.27-1.67-.82 1.8-.8-1.8-.3 1.67h-.49z"
        fill="#fff"
      />
      <path
        id="Vector_167"
        d="M43.9 36.59h.41v1.75h-.41v-.18a.77.77 0 01-1.13 0 1 1 0 01-.24-.67.92.92 0 01.24-.65.73.73 0 011.13 0v-.25zm-1 .87a.62.62 0 00.14.41.429.429 0 00.35.16.459.459 0 00.36-.15.67.67 0 000-.82.46.46 0 00-.36-.15.44.44 0 00-.35.16.56.56 0 00-.1.39h-.04z"
        fill="#fff"
      />
      <path
        id="Vector_168"
        d="M45.23 37v1.37h-.4V37h-.17v-.38h.17V36h.4v.64h.32V37h-.32z"
        fill="#fff"
      />
      <path
        id="Vector_169"
        d="M45.82 36.59h.41v.16a.799.799 0 01.19-.16.46.46 0 01.21 0 .68.68 0 01.34.11l-.19.37a.35.35 0 00-.22-.08c-.22 0-.33.16-.33.49v.91h-.41v-1.8z"
        fill="#fff"
      />
      <path
        id="Vector_170"
        d="M47.08 37.45a.869.869 0 01.27-.64.94.94 0 011.33 1.32 1 1 0 01-1.029.195.88.88 0 01-.301-.205.901.901 0 01-.27-.67zm.42 0a.58.58 0 00.14.42.48.48 0 00.36.13.49.49 0 00.38-.15.67.67 0 000-.82.49.49 0 00-.38-.15.48.48 0 00-.37.15.56.56 0 00-.13.43v-.01z"
        fill="#fff"
      />
      <path
        id="Vector_171"
        d="M49.37 36.59h.41v.16a.66.66 0 01.48-.21.59.59 0 01.47.2.75.75 0 01.15.53v1.07h-.41v-1a.61.61 0 00-.07-.34.27.27 0 00-.25-.1.31.31 0 00-.29.13 1 1 0 00-.08.46v.84h-.41v-1.74z"
        fill="#fff"
      />
      <path
        id="Vector_172"
        d="M51.31 37.45a.869.869 0 01.27-.64.934.934 0 011.32 1.32.94.94 0 01-.67.26.901.901 0 01-.66-.27.94.94 0 01-.26-.67zm.41 0a.63.63 0 00.14.42.56.56 0 00.76 0 .67.67 0 000-.82.56.56 0 00-.76 0 .61.61 0 00-.14.41v-.01z"
        fill="#fff"
      />
      <path
        id="Vector_173"
        d="M53.6 36.59h.4v.16c.06-.061.127-.115.2-.16a.48.48 0 01.22 0 .54.54 0 01.47.26.62.62 0 01.52-.26c.39 0 .59.24.59.72v1.08h-.41v-1a.78.78 0 00-.06-.36.22.22 0 00-.21-.1.26.26 0 00-.24.12.84.84 0 00-.08.41v.9h-.4v-1c0-.31-.09-.46-.27-.46a.27.27 0 00-.25.13.77.77 0 00-.08.4v.9h-.4v-1.74z"
        fill="#fff"
      />
      <path
        id="Vector_174"
        d="M58.1 37.56h-1.25a.477.477 0 00.14.34.45.45 0 00.56.06.929.929 0 00.22-.27l.34.19a1 1 0 01-.16.23.7.7 0 01-.19.16.847.847 0 01-.22.09.996.996 0 01-.25 0 .819.819 0 01-.63-.25.93.93 0 01-.24-.67 1 1 0 01.23-.67.87.87 0 011.23 0 1 1 0 01.22.68v.11zm-.42-.33a.38.38 0 00-.4-.32h-.14L57 37l-.09.11a.52.52 0 00-.06.13l.83-.01z"
        fill="#fff"
      />
    </g>
  );
};

export default SvgMetronome;
