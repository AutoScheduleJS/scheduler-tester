import { IQueryPosition, ITimeBoundary } from '@autoschedule/queries-fn';
import { IConfig } from '@scheduler-tester/core-state/config.interface';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import classNames from 'classnames';
import { withTheme } from 'emotion-theming';
import { split } from 'intervals-fn';
import * as React from 'react';
import { LineArea } from './line-area/line-area';
import { connect } from './util/connect';

interface IPositionViewer {
  start: ITimeBoundary;
  end: ITimeBoundary;
  duration: { min?: number; target?: number };
}

const config = {
  startDate: 0,
  endDate: 50,
};

export const StPositionViewerSimple: React.SFC<IPositionViewer & { className?: string }> = ({
  className,
  start,
  end,
  duration,
}) => {
  let minTime = start.min ? start.min : start.target ? start.target : start.max ? start.max : false;
  let maxTime = end.max ? end.max : end.target ? end.target : end.min ? end.min : false;
  if (!minTime) {
    minTime = !duration.target || !maxTime ? config.startDate : maxTime - duration.target;
  }
  if (!maxTime) {
    maxTime = !duration.target || !minTime ? config.endDate : minTime + duration.target;
  }
  return (
    <div className={classNames(className)}>
      {minTime}-{maxTime}
    </div>
  );
};

interface PositionViewerFromState {
  config: IConfig;
}

interface PositionViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  position: IQueryPosition;
}

const propOrDefault = (defaultValue: any, obj: any, propToCheck: Array<any>): any => {
  if (obj == null) {
    return defaultValue;
  }
  const resultProp = propToCheck.find(prop => obj[prop] != null);
  return resultProp ? obj[resultProp] : defaultValue;
};

const positionToPoints = (position: IQueryPosition, config: IConfig): [number, number][] => {
  const start = split(position.start && position.start.target ? [position.start.target] : [], [
    {
      end: propOrDefault(config.endDate, position.start, ['max']) as number,
      start: propOrDefault(config.startDate, position.start, ['min']) as number,
    },
  ]);
  const end = split(position.end && position.end.target ? [position.end.target] : [], [
    {
      end: propOrDefault(config.endDate, position.end, ['max']) as number,
      start: propOrDefault(config.startDate, position.end, ['min']) as number,
    },
  ]);
  const startArr: [number, number][] =
    start.length === 1
      ? [[start[0].start - 1, 1], [start[0].start, 0]]
      : [[start[0].start, 1], [start[0].end, 0]];
  const endArr: [number, number][] =
    end.length === 1
      ? [[end[0].end - 1, 0], [end[0].end, 1]]
      : [[end[1].start, 0], [end[1].end, 1]];
  console.log('points', [...startArr, ...endArr], start, end);
  return [...startArr, ...endArr];
};

class StPositionViewerImpl extends React.PureComponent<
  PositionViewerProps & PositionViewerFromState
> {
  render() {
    const { position, config, ...defaultHostProps } = this.props;
    return (
      <div {...defaultHostProps}>
        <LineArea
          width={150}
          height={80}
          points={positionToPoints(position, config) /*[[0, 1], [20, 0], [80, 0], [130, 1]]*/}
          division={10}
        />
      </div>
    );
  }
}

const selector = ({ config }: ICoreState): PositionViewerFromState => ({
  config,
});

export const StPositionViewer = connect(selector, coreState$)<
  PositionViewerProps,
  PositionViewerFromState
>(withTheme(StPositionViewerImpl));
