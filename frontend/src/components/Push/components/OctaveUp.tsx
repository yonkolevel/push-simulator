import * as React from 'react';
import { Colors } from '../../../libs/push2/colors';
import { ControlId } from '../../../libs/push2/controls';
import { useToggleControl } from '../../../libs/push2/react/hooks';

const SvgOctaveUp = (props: React.SVGProps<SVGSVGElement>) => {
  const { isOn, toggleControl } = useToggleControl(ControlId.OCTAVE_UP);
  const [mouseDown, setMouseDown] = React.useState(false);

  return (
    <g
      id='octave-up'
      onMouseDown={() => {
        setMouseDown(true);
        toggleControl();
      }}
      onMouseUp={() => {
        setMouseDown(false);
        toggleControl();
      }}
      style={{ opacity: mouseDown ? 0.8 : 1 }}
    >
      <path
        id='Vector_409'
        d='M373.91 269.96l19.9 19.89 19.89-19.89h-39.79z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_410'
        d='M387.43 277.45a1.328 1.328 0 01.43-1 1.427 1.427 0 011-.42 1.37 1.37 0 011 .42 1.354 1.354 0 01.43 1 1.348 1.348 0 01-.43 1 1.472 1.472 0 01-2 0 1.38 1.38 0 01-.43-1zm.42 0a.994.994 0 00.31.75 1.002 1.002 0 00.71.3 1 1 0 00.74-.3 1.04 1.04 0 00.3-.75 1 1 0 00-.3-.74.998.998 0 00-1.623.132 1.004 1.004 0 00-.137.608z'
        fill={isOn ? Colors.Green : '#fff'}
      />
      <path
        id='Vector_411'
        d='M392.14 277.18v.53a1.215 1.215 0 00-.25-.23.507.507 0 00-.25-.06.48.48 0 00-.38.16.546.546 0 00-.15.4.59.59 0 00.14.4.496.496 0 00.38.16.507.507 0 00.25-.06.903.903 0 00.26-.24v.53a1 1 0 01-1.17-.13.922.922 0 010-1.32.93.93 0 01.68-.27.99.99 0 01.49.13z'
        fill={isOn ? Colors.Green : '#fff'}
      />
      <path
        id='Vector_412'
        d='M392.94 277.48v1.37h-.4v-1.37h-.17v-.38h.17v-.64h.4v.64h.32v.38h-.32z'
        fill={isOn ? Colors.Green : '#fff'}
      />
      <path
        id='Vector_413'
        d='M394.85 277.1h.41v1.75h-.41v-.18a.768.768 0 01-.858.165.787.787 0 01-.272-.195 1 1 0 010-1.33.77.77 0 01.59-.26.751.751 0 01.54.25v-.2zm-1 .87a.607.607 0 00.13.41.432.432 0 00.35.16.442.442 0 00.36-.16.59.59 0 00.14-.4.623.623 0 00-.14-.41.457.457 0 00-.36-.15.462.462 0 00-.35.15.601.601 0 00-.08.43l-.05-.03z'
        fill={isOn ? Colors.Green : '#fff'}
      />
      <path
        id='Vector_414'
        d='M396 277.1l.45 1 .45-1h.46l-.91 1.87-.9-1.87h.45z'
        fill={isOn ? Colors.Green : '#fff'}
      />
      <path
        id='Vector_415'
        d='M399.18 278.07h-1.26a.589.589 0 00.14.34.416.416 0 00.32.13.461.461 0 00.25-.07.926.926 0 00.22-.27l.34.19a.988.988 0 01-.16.23.713.713 0 01-.19.16.878.878 0 01-.22.09c-.083.01-.167.01-.25 0a.816.816 0 01-.63-.25.93.93 0 01-.24-.67.998.998 0 01.23-.67.804.804 0 01.62-.26.787.787 0 01.61.25.998.998 0 01.22.68v.12zm-.42-.33a.367.367 0 00-.136-.24.365.365 0 00-.264-.08.33.33 0 00-.14 0 .45.45 0 00-.12.06.31.31 0 00-.09.11.386.386 0 00-.06.13l.81.02z'
        fill={isOn ? Colors.Green : '#fff'}
      />
      <path
        id='Vector_416'
        d='M390.66 285.94l3.48-3.48h-.88l3.23 3.24a.63.63 0 00.89-.89l-3.24-3.23a.63.63 0 00-.88 0l-3.48 3.48a.621.621 0 10.88.88z'
        fill={isOn ? Colors.Green : '#fff'}
      />
    </g>
  );
};

export default SvgOctaveUp;
