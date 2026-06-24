import * as React from 'react';
import { ControlId, ControlType } from '../../../libs/push2/controls';
import Control from '../Control';


const SvgDivision16Th = (props: React.SVGProps<SVGSVGElement>) => {

  return (
    <Control
      {...props}
      id='division-16th'
      name='division-16th'
      type={ControlType.CC}
      controlId={ControlId.GRID_DIVISION_5}
    >
      <path
        id='Vector_401'
        d='M344.74 230.61h20.19v-21.48h-20.19v21.48z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_402'
        d='M358.71 221l3 3v-.88l-3.38 3.38a.621.621 0 10.88.88l3.39-3.38a.63.63 0 000-.88l-3-3a.621.621 0 10-.88.88h-.01z'
        fill='#fff'
      />
    </Control>
  );
};

export default SvgDivision16Th;
