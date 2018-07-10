import { IPotentiality } from '../../../queries-scheduler/es';
import * as React from 'react';
import { IItemProps } from './timeline';

interface IPotentialItem extends IPotentiality {
  start: number;
  end: number;
}

const cmp: React.SFC<IItemProps<IPotentialItem>> = ({ item }) => (
  <div>
    {item.queryId}-{item.potentialId}
  </div>
);

export default cmp;
