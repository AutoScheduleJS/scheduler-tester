import { IMaterial } from '@autoschedule/queries-scheduler';
import * as React from 'react';
import { IItemProps } from './timeline';

const cmp: React.SFC<IItemProps<IMaterial>> = ({ item }) => (
  <div>
    {item.queryId}-{item.materialId}
  </div>
);

export default cmp;
