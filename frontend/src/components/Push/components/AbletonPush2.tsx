import { Box, Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import * as React from "react";
import SvgAccent from "./Accent";
import SvgAddDevice from "./AddDevice";
import SvgAddTrack from "./AddTrack";
import SvgArrowDown from "./ArrowDown";
import SvgArrowLeft from "./ArrowLeft";
import SvgArrowRight from "./ArrowRight";
import SvgArrowUp from "./ArrowUp";
import SvgAutomation from "./Automation";
import BottomSoftButtons from "./BottomSoftButtons";
import SvgBrowse from "./Browse";
import SvgClip from "./Clip";
import SvgConvert from "./Convert";
import SvgDelete from "./Delete";
import SvgDevice from "./Device";
import SvgDivision16Th from "./Division16Th";
import SvgDvivision16ThTriplet from "./Division16ThTriplet";
import SvgDivision32Th from "./Division32Th";
import SvgDivision32ThTriplet from "./Division32ThTriplet";
import SvgDivision4Th from "./Division4Th";
import SvgDivision4ThTriplet from "./Division4ThTriplet";
import SvgDivision8Th from "./Division8Th";
import SvgDivision8ThTriplet from "./Division8ThTriplet";
import SvgDoubleLoop from "./DoubleLoop";
import SvgDuplicate from "./Duplicate";
import SvgFixedLength from "./FixedLength";
import SvgLayout from "./Layout";
import SvgMaster from "./Master";
import SvgMetronome from "./Metronome";
import SvgMix from "./Mix";
import SvgMute from "./Mute";
import SvgNew from "./New";
import SvgNote from "./Note";
import SvgOctaveDown from "./OctaveDown";
import SvgOctaveUp from "./OctaveUp";
import SvgPads from "./Pads";
import SvgPageLeft from "./PageLeft";
import SvgPageRight from "./PageRight";
import SvgPlay from "./Play";
import SvgQuantize from "./Quantize";
import SvgRecord from "./Record";
import SvgRepeat from "./Repeat";
import SvgRotaryButtons from "./RotaryButtons";
import SvgSelect from "./Select";
import SvgSession from "./Session";
import SvgSetup from "./Setup";
import SvgShift from "./Shift";
import SvgSoftButton10 from "./SoftButton10";
import SvgSoftButton11 from "./SoftButton11";
import SvgSoftButton12 from "./SoftButton12";
import SvgSoftButton13 from "./SoftButton13";
import SvgSoftButton14 from "./SoftButton14";
import SvgSoftButton15 from "./SoftButton15";
import SvgSoftButton16 from "./SoftButton16";
import SvgSoftButton9 from "./SoftButton9";
import SvgSolo from "./Solo";
import SvgStopClip from "./StopClip";
import SvgTapTempo from "./TapTempo";
import TopSoftButtons from "./TopSoftButtons";
import SvgTouchStrip from "./TouchStrip";
import SvgUndo from "./Undo";
import SvgUser from "./User";

export const getHighlighted = (highlighted: string[]) => {
  if (!highlighted || highlighted.length === 0) {
    return ``;
  }

  let not = ``;

  for (let index = 0; index < highlighted.length; index++) {
    not = not + `:not(${highlighted[index]})`;
  }
  return `
    & > ${not} {
      opacity: 0.2;
    }
  `;
};

const InnnerSvg = styled("svg")<{ highlighted?: string[] }>`
  ${(props) => props.highlighted && getHighlighted(props.highlighted)}
`;

const SvgAbletonPush2: React.FunctionComponent<
  React.SVGProps<SVGElement> | any
> = ({ ...props }) => {
  return (
    <Flex>
      <Box width={1}>
        <svg
          width="100vw"
          height="100vh"
          viewBox="0 0 422 339"
          fill="none"
          {...props}
        >
          <g id="ableton-push2">
            <path
              id="screen"
              d="M332.32 56.91H76.61v44.6h255.71v-44.6z"
              fill="#3C3C3B"
            />
            <path id="body" d="M421.21.8H0v338.14h421.21V.8z" fill="#1D1D1B" />
            <InnnerSvg
            // highlighted={highlighted}
            >
              <SvgPads
                onMouseDown={(id: string) => {
                  alert(id);
                }}
              />
              <BottomSoftButtons />
              <SvgRotaryButtons />

              <SvgTouchStrip />
              <SvgPlay />
              <SvgRecord />
              <SvgTapTempo />
              <SvgMetronome />
              <SvgDelete />
              <SvgUndo />
              <SvgMute />
              <SvgConvert />
              <SvgDoubleLoop />
              <SvgQuantize />
              <SvgDuplicate />
              <SvgNew />
              <SvgFixedLength />
              <SvgAutomation />
              <SvgSolo />
              <SvgStopClip />
              <SvgSetup />
              <SvgAddDevice />
              <SvgDevice />
              <SvgAddTrack />
              <SvgBrowse />
              <SvgClip />
              <SvgMix />
              <SvgMaster />
              <SvgRepeat />
              <SvgAccent />
              <SvgLayout />
              <SvgNote />
              <SvgSession />
              <SvgSelect />
              <SvgShift />
              <SvgUser />
              <SvgArrowLeft />
              <SvgArrowDown />
              <SvgArrowRight />
              <SvgArrowUp />
              <SvgPageLeft />
              <SvgOctaveDown />
              <SvgPageRight />

              <SvgDivision4Th />
              <SvgDivision4ThTriplet />
              <SvgDivision8Th />
              <SvgDivision8ThTriplet />
              <SvgDivision16Th />
              <SvgDvivision16ThTriplet />
              <SvgDivision32Th />
              <SvgDivision32ThTriplet />

              <SvgOctaveUp />
              <TopSoftButtons />
            </InnnerSvg>
          </g>
        </svg>
      </Box>
    </Flex>
  );
};

export default SvgAbletonPush2;
