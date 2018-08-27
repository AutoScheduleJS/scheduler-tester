import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
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
  opacityRange: IRange;
}

interface TimelineTheme {
  timeline: {
    height: string;
    lineColor: string;
  };
}

const defaultTheme = (theme: any): TimelineTheme =>
  merge(
    {
      timeline: {
        height: '72px',
        lineColor: theme.palette.primary.main,
      },
    } as TimelineTheme,
    theme
  );

const percentToHexString = (percent: number) => {
  const decimal = Math.round(255 * percent);
  const suffix = decimal < 17 ? '0' : '';
  return suffix + decimal.toString(16);
};

const themeToHostStyles = (theme: TimelineTheme) => {
  const t = theme.timeline;

  return css`
    height: ${t.height};
    position: relative;
  `;
};

const lineStyle = (theme, opacityRange) => {
  const t = theme.timeline;
  const gradientOpaque = t.lineColor + 'FF';
  const maskStart = '#FFFFFF' + percentToHexString(opacityRange.start);
  const maskEnd = '#FFFFFF' + percentToHexString(opacityRange.end);
  return css`
    position: absolute;
    left: 0;
    right: 0;
    top: 47%;
    bottom: 47%;
    z-index: -1;
    border-radius: 3px;
    background: linear-gradient(to right, ${maskStart} 0%, ${maskEnd} 100%), ${gradientOpaque};`;
};

class TimelineImpl<T extends ITimeItem> extends React.PureComponent<ICmpProps<T> & TimelineProps> {
  render() {
    const {
      range,
      items,
      ItemCmp,
      opacityRange,
      theme: incomingTheme,
      ...defaultHostProps
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    const timeItemCmps = itemsArrayToCmp<T>(computePositionWithRange(range), items, ItemCmp);
    const hostProps = mergeProps(defaultHostProps, {
      className: themeToHostStyles(theme),
    });
    return (
      <div {...hostProps}>
        {timeItemCmps}
        <div className={lineStyle(theme, opacityRange)} />
      </div>
    );
  }
}

const itemsArrayToCmp = <T extends ITimeItem>(
  computePosition: (item: ITimeItem) => string,
  items: timeItems<T>,
  ItemCmp: React.ComponentType<IItemProps<T>>
) => {
  return items.map(item => {
    if (Array.isArray(item)) {
      return itemsArrayToCmp(computePosition, item, ItemCmp);
    }
    const hostProps = { item, className: computePosition(item) };
    return <ItemCmp {...hostProps} />;
  });
};

const computePositionWithRange = (range: IRange) => (item: ITimeItem): string => {
  const totalAmount = range.end - range.start;
  const itemAmount = item.end - item.start;
  const sinceStart = item.start - range.start;
  const progress = 100 * sinceStart / totalAmount;
  const width = 100 * itemAmount / totalAmount;
  return css`
    left: ${progress + '%'};
    top: ${top + 'px'};
    width: ${width + '%'};
    position: absolute;
  `;
};

export const StTimeLine = withTheme<ICmpProps<any> & TimelineProps>(TimelineImpl);
