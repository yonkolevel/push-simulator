import * as React from 'react';
import { ControlId, ControlType } from '../../../libs/push2/controls';
import Control from '../Control';


const SvgDivision4Th = (props: React.SVGProps<SVGSVGElement>) => {

  return (
    <Control
      {...props}
      id='division-4th'
      name='division-4th'
      type={ControlType.CC}
      controlId={ControlId.GRID_DIVISION_1}
    >
      <path
        id='Vector_393'
        d='M345.06 327.81h20.19v-21.48h-20.19v21.48z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_394'
        d='M358.71 318.09l3 3v-.88l-3.38 3.38c-.57.57.31 1.46.88.89l3.39-3.39a.63.63 0 000-.88l-3-3c-.57-.57-1.45.32-.88.89l-.01-.01z'
        fill='#fff'
      />
    </Control>
  );
};

export default SvgDivision4Th;
