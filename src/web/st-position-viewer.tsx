import { IQueryPosition, ITimeBoundary } from '@autoschedule/queries-fn';
import { IConfig } from '@scheduler-tester/core-state/config.interface';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import classNames from 'classnames';
import { withTheme } from 'emotion-theming';
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

/**
 * https://medium.com/@Elijah_Meeks/interactive-applications-with-react-d3-f76f7b3ebc71
 * https://codepen.io/swizec/pen/QdVoOg
 */
class StPositionViewerImpl extends React.PureComponent<
  PositionViewerProps & PositionViewerFromState
> {
  render() {
    const { position, ...defaultHostProps } = this.props;
    return (
      <div {...defaultHostProps}>
        <LineArea width={150} height={80} points={[[0, 50], [20, 0], [80, 0], [130, 50]]} division={10} />
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
