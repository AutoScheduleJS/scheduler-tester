import { IQuery } from '@autoschedule/queries-fn';
import {
  combineSchedulerObservables,
  IMaterial,
  IPotentiality,
  queriesToPipelineDebug$,
} from '@autoschedule/queries-scheduler';
import { queryToStatePotentials } from '@autoschedule/userstate-manager';
import { ICoreState, StepOption } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { forkJoin, of, Subject } from 'rxjs';
import { map, switchMap, zip } from 'rxjs/operators';
import { StMaterialViewer } from './st-material-viewer';
import { StTimeLine } from './st-timeline';
import { connect } from './util/connect';
import { merge, mergeProps } from './util/hoc.util';
import { PaddingProps } from './responsive/padding';

interface ICmpProps {
  state: ICoreState;
  errors: any;
  pots: IPotentiality[];
  mats: IMaterial[];
  press: any[];
}

interface DemoViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

interface DemoViewerTheme {
  demoViewer: {
    shape: string;
  };
}

const defaultTheme = (theme: any): DemoViewerTheme =>
  merge(
    {
      demoViewer: {
      },
    } as DemoViewerTheme,
    theme
  );

const themeToHostStyles = (theme: DemoViewerTheme) => {
  const dv = theme.demoViewer;
  return css`
    border-radius: 25px 25px 0 0;
  `;
};

const timelinesContainerStyles = css`
  /* display: flex; */
`;

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
    const { state, errors, mats, theme: incomingTheme, ...defaultHostProps } = this.props;
    const theme = defaultTheme(incomingTheme);
    if (!state) {
      return null;
    }
    const config = state.config;
    const ranges = [
      { range: { start: config.startDate, end: config.endDate / 2 }, opacity: { start: 0, end: 0.5 } },
      { range: { start: config.endDate / 2, end: config.endDate }, opacity: { start: 0.5, end: 1 } },
    ];
    const hostProps = mergeProps(
      PaddingProps(theme),
      { className: themeToHostStyles(theme) },
      defaultHostProps
    );
    return (
      <div {...hostProps}>
        <div className={timelinesContainerStyles}>
          {ranges.map(range => (
            <StTimeLine
              range={range.range}
              opacityRange={range.opacity}
              ItemCmp={StMaterialViewer}
              items={mats.map(getMaterial(state)) || []}
            />
          ))}
        </div>
      </div>
    );
  }
}

export interface IMaterialUI extends IMaterial {
  name: string;
}

const getMaterial = (state: ICoreState) => (mat: IMaterial): IMaterialUI => {
  const query = state.suites[state.onTestbenchQueries].find(
    query => query.id === mat.queryId
  ) as IQuery;
  return { ...mat, name: query.name };
};

const selector = ([state, errors, _, mats, __]: [ICoreState, any, any, any, any]) => ({
  state,
  errors,
  mats,
});

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
        return result$.pipe(map(res => [state, ...res]));
      } catch (e) {
        console.error(e);
        return of([state, e, [], [], []]);
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
