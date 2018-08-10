import {
  combineSchedulerObservables,
  IMaterial,
  IPotentiality,
  queriesToPipelineDebug$,
} from '@autoschedule/queries-scheduler';
import { queryToStatePotentials } from '@autoschedule/userstate-manager';
import { IConfig } from '@scheduler-tester/core-state/config.interface';
import { ICoreState, StepOption } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { forkJoin, of, Subject } from 'rxjs';
import { map, switchMap, zip } from 'rxjs/operators';
import { StMaterialViewer } from './st-material-viewer';
import { TimeLine } from './timeline';
import { connect } from './util/connect';
import { merge } from './util/hoc.util';

interface ICmpProps {
  config: IConfig;
  errors: any;
  pots: IPotentiality[];
  mats: IMaterial[];
  press: any[];
}

interface DemoViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

interface DemoViewerTheme {
  demoViewer: {};
}

const defaultTheme = (theme: any): DemoViewerTheme => merge({}, theme);

/**
 * display time rule, horizontal scroll
 *
 * high card with: time duration & identification (color, name, split Id)
 * responsive:
 * - rule density
 * - card: ID instead of name, no time duration
 */
class DemoViewerImpl extends React.PureComponent<ICmpProps & DemoViewerProps> {
  state = {
    subDivision: 2,
  };
  render() {
    const { config, errors, mats, theme: incomingTheme, ...hostProps } = this.props;
    const theme = defaultTheme(incomingTheme);
    if (!config) {
      return null;
    }
    const ranges = [
      { start: config.startDate, end: config.endDate / 2 },
      { start: config.endDate / 2, end: config.endDate },
    ];
    return (
      <div {...hostProps}>
        <div>{displayData(errors)}</div>
        {ranges.map(range => (
          <TimeLine range={range} ItemCmp={StMaterialViewer} items={mats || []} />
        ))}
      </div>
    );
  }
}

const selector = ([config, errors, _, mats, __]: [any, any, any, any, any]) => ({
  config,
  errors,
  mats,
});

const displayData = (data: any) => {
  const val = data || {};
  return JSON.stringify(val);
};

const nextState$ = new Subject<never>();

/* tslint:disable:no-object-literal-type-assertion */

const stateToScheduler = state$ =>
  state$.pipe(
    switchMap((state: ICoreState) => {
      try {
        const [er, pots, mats, press] = queriesToPipelineDebug$(state.config)(
          queryToStatePotentials([])
        )(stateToQueries(state));
        const err$ = er;
        const result$ =
          state.stepOption === StepOption.every
            ? nextState$.pipe(
                zip(combineSchedulerObservables(err$, pots, mats, press), (_, schedule) => schedule)
              )
            : forkJoin(err$, pots, mats, press);
        return result$.pipe(map(res => [state.config, ...res]));
      } catch (e) {
        console.error(e);
        return of([state.config, e, [], [], []]);
      }
    })
  );
/* tslint:enable:no-object-literal-type-assertion */

const stateToQueries = (state: ICoreState): ReadonlyArray<any> => [
  ...(state.suites[state.onTestbenchQueries] || []).map(o => ({ ...o })),
];

export const StDemoViewer = connect(selector, stateToScheduler(coreState$))<
  DemoViewerProps,
  ICmpProps
>(withTheme(DemoViewerImpl));
