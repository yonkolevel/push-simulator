import * as React from 'react';
import { ControlId, ControlType } from '../../../libs/push2/controls';
import Control from '../Control';


const SvgDvivision16ThTriplet = (props: React.SVGProps<SVGSVGElement>) => {

  return (
    <Control
      {...props}
      id='division-16th-triplet'
      name='division-16th-triplet'
      type={ControlType.CC}
      controlId={ControlId.GRID_DIVISION_6}
    >
      <path
        id='Vector_403'
        d='M344.74 206.06h20.19v-21.48h-20.19v21.48z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_404'
        d='M358.71 196.53l3 3v-.89L358.3 202a.621.621 0 10.88.88l3.39-3.38a.642.642 0 000-.89l-3-3a.621.621 0 10-.88.88l.02.04z'
        fill='#fff'
      />
    </Control>
  );
};

export default SvgDvivision16ThTriplet;
