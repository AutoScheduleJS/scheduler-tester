import {
  combineSchedulerObservables,
  IMaterial,
  IPotentiality,
  placeToRange,
  queriesToPipelineDebug$,
} from '@autoschedule/queries-scheduler';
import { queryToStatePotentials } from '@autoschedule/userstate-manager';
import { IConfig } from '@scheduler-tester/core-state/config.interface';
import { ICoreState, StepOption } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import * as React from 'react';
import { forkJoin, of, Subject } from 'rxjs';
import { map, switchMap, zip } from 'rxjs/operators';
import { MaterialViewer } from './material-viewer';
import PotentialViewer from './potential-viewer';
import PressureViewer from './pressure-viewer';
import TimeLine from './timeline';
import { connect } from './util/connect';

interface ICmpProps {
  config: IConfig;
  errors: any;
  pots: IPotentiality[];
  mats: IMaterial[];
  press: any[];
}

class DemoViewerImpl extends React.PureComponent<ICmpProps & { className?: string }> {
  render() {
    const { className, config, errors, pots, mats, press } = this.props;
    return (
      <div className={className}>
        <div>{displayData(errors)}</div>
        Potentials:<TimeLine
          {...{
            ItemCmp: PotentialViewer,
            config,
            items: potsToPotsItem(pots || []),
          }}
        />
        Materials:<TimeLine
          {...{
            ItemCmp: MaterialViewer,
            config,
            items: mats || [],
          }}
        />
        Pressure:<TimeLine
          {...{
            ItemCmp: PressureViewer,
            config,
            items: press || [],
          }}
        />
        <button onClick={() => nextState$.next()}>NEXT</button>
      </div>
    );
  }
}

const potsToPotsItem = (pots: IPotentiality[]) => {
  return pots.map(pot => pot.places.map(place => ({ ...placeToRange(place), ...pot })));
};

const selector = ([config, errors, pots, mats, press]: [any, any, any, any, any]) => ({
  config,
  errors,
  mats,
  pots,
  press,
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

export const StDemoViewer = connect(selector, stateToScheduler(coreState$))<{}, ICmpProps>(
  DemoViewerImpl
);
