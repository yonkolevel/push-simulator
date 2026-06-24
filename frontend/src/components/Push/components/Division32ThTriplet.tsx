import * as React from 'react';
import { ControlId, ControlType } from '../../../libs/push2/controls';
import Control from '../Control';


const SvgDivision32ThTriplet = (props: React.SVGProps<SVGSVGElement>) => {

  return (
    <Control
      {...props}
      id='division-32th-triplet'
      name='division-32th-triplet'
      type={ControlType.CC}
      controlId={ControlId.GRID_DIVISION_8}
    >
      <path
        id='Vector_407'
        d='M344.74 156.99h20.19v-21.48h-20.19v21.48z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_408'
        d='M358.71 146.94l3 3V149l-3.38 3.38c-.57.57.31 1.46.88.89l3.39-3.39a.63.63 0 000-.88l-3-3c-.57-.57-1.45.32-.88.89l-.01.05z'
        fill='#fff'
      />
    </Control>
  );
};

export default SvgDivision32ThTriplet;
