import * as React from 'react';
import { ControlId, ControlType } from '../../../libs/push2/controls';
import Control from '../Control';


const SvgDivision4ThTriplet = (props: React.SVGProps<SVGSVGElement>) => {

  return (
    <Control
      {...props}
      id='division-4th'
      name='division-4th'
      type={ControlType.CC}
      controlId={ControlId.GRID_DIVISION_2}
    >
      <path
        id='Vector_395'
        d='M345.37 304.23h20.19v-21.48h-20.19v21.48z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_396'
        d='M358.71 293.66l3 3v-.89l-3.38 3.39a.621.621 0 10.88.88l3.39-3.38a.642.642 0 000-.89l-3-3a.621.621 0 10-.88.88l-.01.01z'
        fill='#fff'
      />
    </Control>
  );
};
export default SvgDivision4ThTriplet;
