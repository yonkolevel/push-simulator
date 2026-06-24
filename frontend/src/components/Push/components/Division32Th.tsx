import * as React from 'react';
import { ControlId, ControlType } from '../../../libs/push2/controls';
import Control from '../Control';


const SvgDivision32Th = (props: React.SVGProps<SVGSVGElement>) => {

  return (
    <Control
      {...props}
      id='division-32th'
      name='division-32th'
      type={ControlType.CC}
      controlId={ControlId.GRID_DIVISION_7}
    >
      <path
        id='Vector_405'
        d='M344.74 181.53h20.19v-21.48h-20.19v21.48z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_406'
        d='M358.71 172l3 3v-.88l-3.38 3.38c-.57.57.31 1.46.88.89l3.39-3.39a.63.63 0 000-.88l-3-3a.63.63 0 00-.88.89l-.01-.01z'
        fill='#fff'
      />
    </Control>
  );
};

export default SvgDivision32Th;
