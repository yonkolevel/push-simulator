import * as React from 'react';
import { ControlId, ControlType } from '../../../libs/push2/controls';
import Control from '../Control';


const SvgPageRight = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <Control
      {...props}
      id='page-left'
      name='page-left'
      type={ControlType.CC}
      controlId={ControlId.PAGE_RIGHT}
    >
      <path
        id='Vector_391'
        d='M414.22 310.26v-39.78l-19.9 19.89 5.83 5.82 14.07 14.07z'
        fill='#3C3C3B'
      />
      <path
        id='Vector_392'
        d='M398.9 288.11l3 3v-.88l-3.38 3.38c-.57.57.31 1.46.88.89l3.39-3.39a.63.63 0 000-.88l-3-3c-.57-.57-1.45.32-.88.89l-.01-.01z'
        fill='#fff'
      />
    </Control>
  );
};

export default SvgPageRight;
