import * as React from 'react';
import { ControlId, ControlType } from '../../../libs/push2/controls';
import Control from '../Control';


const SvgOctaveDown = (props: React.SVGProps<SVGSVGElement>) => {

  return (
    <Control
      {...props}
      id='octave-down'
      name='octave-down'
      type={ControlType.CC}
      controlId={ControlId.OCTAVE_DOWN}
    >
      <path
        id='Vector_389'
        d='M373.91 310.78h39.79l-14.07-14.07-5.82-5.82-5.83 5.82-14.07 14.07z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_390'
        d='M396.11 296l-3.32 3.32h.88l-3.16-3.16a.621.621 0 10-.88.88l3.16 3.17a.652.652 0 00.88 0l3.33-3.33c.57-.57-.32-1.45-.89-.88z'
        fill='#fff'
      />
    </Control>
  );
};

export default SvgOctaveDown;
