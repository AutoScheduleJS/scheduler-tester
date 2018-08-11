import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { intersect, isOverlapping } from 'intervals-fn';
import * as React from 'react';
import { merge, mergeProps } from './util/hoc.util';

interface IRange {
  start: number;
  end: number;
}

export type timeItems<T extends ITimeItem> = Array<T | T[]>;
export interface ITimeItem {
  end: number;
  start: number;
}

export interface IItemProps<T extends ITimeItem> {
  item: T;
}

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

interface ICmpProps<T extends ITimeItem> {
  range: IRange;
  items: timeItems<T>;
  ItemCmp: React.ComponentType<IItemProps<T>>;
}

interface TimelineTheme {
  timeline: {
    height: string;
  };
}

const defaultTheme = (theme: any): TimelineTheme =>
  merge(
    {
      timeline: {
        height: '48px'
      },
    } as TimelineTheme,
    theme
  );

const themeToHostStyles = (theme: TimelineTheme) => {
  console.log(theme);
  const t = theme.timeline;
  return css`
    height: ${t.height};
    position: relative;
  `;
}

class TimelineImpl<T extends ITimeItem> extends React.PureComponent<ICmpProps<T> & TimelineProps> {
  render() {
    const { range, items, ItemCmp, theme: incomingTheme, ...defaultHostProps } = this.props;
    const { check, getMax } = checkOverlapsGen();
    const theme = defaultTheme(incomingTheme);
    const timeItemCmps = itemsArrayToCmp<T>(
      computePositionWithConf(range, check),
      60,
      items,
      ItemCmp
    );
    const hostProps = mergeProps(defaultHostProps, {
      className: themeToHostStyles(theme)
    });
    return (
      <div {...hostProps}>
        {timeItemCmps}
      </div>
    );
  }
}

const itemsArrayToCmp = <T extends ITimeItem>(
  computePosition: (item: ITimeItem, colorIndex: number) => string,
  colorIndex: number,
  items: timeItems<T>,
  ItemCmp: React.ComponentType<IItemProps<T>>
) => {
  let newColorIndex = colorIndex;
  return items.map(item => {
    if (Array.isArray(item)) {
      newColorIndex = (newColorIndex + 75) % 360;
      return itemsArrayToCmp(computePosition, newColorIndex, item, ItemCmp);
    }
    return (
      <div className={computePosition(item, colorIndex)}>
        <ItemCmp {...{ item }} />
      </div>
    );
  });
};

const computePositionWithConf = (
  conf: IRange,
  checkOverlaps: (width: number, progress: number) => number
) => (item: ITimeItem, colorIndex: number): string => {
  const totalAmount = conf.end - conf.start;
  const itemAmount = item.end - item.start;
  const sinceStart = item.start - conf.start;
  const progress = 100 * sinceStart / totalAmount;
  const width = 100 * itemAmount / totalAmount;
  const top = checkOverlaps(width, progress) * 10;
  return css`
    left: ${progress + '%'};
    top: ${top + 'px'};
    width: ${width + '%'};
    background-color: hsla(${colorIndex}, 100%, 70%, 0.1);
    position: absolute;
    opacity: 0.85;
    outline: 1px solid black;
  `;
};

const checkOverlapsGen = () => {
  let elems: ReadonlyArray<{ start: number; end: number; layer: number }> = [];
  return {
    check: (width: number, progress: number): number => {
      const toCheck = { start: progress, end: progress + width, layer: 0 };
      const intersection = intersect([toCheck], elems);
      const result = intersection.length ? intersection[0].layer + 1 : 0;
      elems = merge(
        toMerge =>
          toMerge.reduce((a, b) => {
            const maxLayer = Math.max(a.layer, b.layer);
            return { ...a, layer: isOverlapping(a, b) ? maxLayer + 1 : maxLayer };
          }, toCheck),
        [...elems, toCheck]
      );
      return result;
    },
    getMax: () =>
      elems.reduce((a, b) => (a.layer > b.layer ? a : b), { start: 0, end: 0, layer: 0 }).layer,
  };
};

export const TimeLine = withTheme<ICmpProps<any> & TimelineProps>(TimelineImpl);
