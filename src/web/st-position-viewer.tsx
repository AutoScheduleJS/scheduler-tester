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

const getTipRange = (position: IQueryPosition, tipKind: keyof IQueryPosition, config: IConfig) => {
  const tip = position[tipKind];
  return split(tip && tip.target ? [tip.target] : [], [
    {
      end: propOrDefault(config.endDate, tip, ['max']) as number,
      start: propOrDefault(config.startDate, tip, ['min']) as number,
    },
  ]);
};

const tipRangeToPoints = (
  tip: Array<{ start: number; end: number }>,
  origin: number,
  tipKind: keyof IQueryPosition
): [number, number][] => {
  const y1 = tipKind === 'start' ? 1 : 0;
  const y2 = tipKind === 'start' ? 0 : 1;

  return tip.length === 1
    ? [[origin + tip[0][tipKind] - 1, y1], [origin + tip[0][tipKind], y2]]
    : [[origin + tip[0].start, y1], [origin + tip[0].end, y2]];
};

const positionToPoints = (
  position: IQueryPosition,
  config: IConfig,
  origin: number
): [number, number][] => {
  const start = getTipRange(position, 'start', config);
  const end = getTipRange(position, 'end', config);
  const startArr = tipRangeToPoints(start, origin, 'start');
  const endArr = tipRangeToPoints(end, origin, 'end');
  console.log('points', [...startArr, ...endArr], start, end);
  return [...startArr, ...endArr];
};

class StPositionViewerImpl extends React.PureComponent<
  PositionViewerProps & PositionViewerFromState
> {
  render() {
    const { position, config, ...defaultHostProps } = this.props;
    const points = positionToPoints(position, config, 25);

    return (
      <div {...defaultHostProps}>
        <LineArea
          width={150}
          height={80}
          abscissaUnit={1}
          ordinateUnit={65}
          points={points}
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
