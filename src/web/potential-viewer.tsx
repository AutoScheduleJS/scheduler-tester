import { IPotentiality } from '@autoschedule/queries-scheduler';
import * as React from 'react';
import { IItemProps } from './st-timeline';

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
