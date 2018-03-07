import { css } from 'emotion';
import * as React from 'react';

import { IConfig } from '@scheduler-tester/core-state/config.interface';

import {} from '../shared/style.css';

export type timeItems<T extends ITimeItem> = Array<T | T[]>;
export interface ITimeItem {
  end: number;
  start: number;
}

export interface IItemProps<T extends ITimeItem> {
  item: T;
}

interface ICmpProps<T extends ITimeItem> {
  config: IConfig;
  items: timeItems<T>;
  ItemCmp: React.SFC<IItemProps<T>>;
}
const cmp = <T extends ITimeItem>({
  config,
  items,
  ItemCmp,
}: ICmpProps<T>): React.ReactElement<any> => (
  <div
    className={css`
      position: relative;
    `}
  >
    {itemsArrayToCmp<T>(computePositionWithConf(config), 60, items, ItemCmp)}
  </div>
);

const itemsArrayToCmp = <T extends ITimeItem>(
  computePosition: (item: ITimeItem, colorIndex: number) => string,
  colorIndex: number,
  items: timeItems<T>,
  ItemCmp: React.SFC<IItemProps<T>>
) => {
  return items.map(item => {
    if (Array.isArray(item)) {
      return itemsArrayToCmp(computePosition, (colorIndex + 188) % 360, item, ItemCmp);
    }
    return (
      <div className={computePosition(item, colorIndex)}>
        <ItemCmp {...{ item }} />
      </div>
    );
  });
};

const computePositionWithConf = (conf: IConfig) => (item: ITimeItem, colorIndex: number): string => {
  const totalAmount = conf.endDate - conf.startDate;
  const itemAmount = item.end - item.start;
  const sinceStart = item.start - conf.startDate;
  const progress = 100 * sinceStart / totalAmount;
  const width = 100 * itemAmount / totalAmount;
  return css`
    left: ${progress + '%'};
    position: relative;
    opacity: 0.85;
    width: ${width + '%'};
    background-color: hsla(${colorIndex}, 100%, 70%, 0.5);
    border: 1px solid black;
  `;
};

export default cmp;
