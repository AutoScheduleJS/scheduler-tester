import * as React from 'react';
import { IItemProps } from './timeline';

interface IPressureItem {
  start: number;
  end: number;
  [key: string]: any;
}

const cmp: React.SFC<IItemProps<IPressureItem>> = ({ item }) => <div>{item.pressure}</div>;

export default cmp;
