import classNames from 'classnames';
import * as React from 'react';
import { ITimeBoundary } from '../../../queries-fn/es';

interface IPositionViewer {
  start: ITimeBoundary;
  end: ITimeBoundary;
  duration: { min?: number; target?: number };
}

const config = {
  startDate: 0,
  endDate: 50,
};

export const StPositionViewer: React.SFC<IPositionViewer & { className?: string }> = ({
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
