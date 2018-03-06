
import {
  combineSchedulerObservables,
  IMaterial,
  IPotentiality,
  queriesToPipelineDebug$,
} from '@autoschedule/queries-scheduler';
import { queryToStatePotentials } from '@autoschedule/userstate-manager';
import { IConfig } from '@scheduler-tester/core-state/config.interface';
import { ICoreState, StepOption } from '@scheduler-tester/core-state/core.state';
import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/forkJoin';

import { map, switchMap, zip } from 'rxjs/operators';


import { connect } from '../util/connect';

interface ICmpProps {
  config: IConfig;
  errors: any;
  pots: ReadonlyArray<IPotentiality>;
  mats: ReadonlyArray<IMaterial>;
  press: ReadonlyArray<any>;
}

const cmp: React.SFC<ICmpProps> = ({ config, errors, pots, mats, press }) => (
  <div>
    <div>{displayData(errors)}</div>
    <div>{displayData(pots)}</div>
    <div>{displayData(mats)}</div>
    <div>{displayData(press)}</div>
    <button onClick={() => nextState$.next()}>NEXT</button>
  </div>
);

const selector = ([config, errors, pots, mats, press]: [any, any, any, any, any]) => ({
  config,
  errors,
  mats,
  pots,
  press,
});

export default connect(selector)(cmp);

const displayData = (data: any) => {
  const val = data || {};
  return JSON.stringify(val);
};

const nextState$ = new Subject<never>();

/* tslint:disable:no-object-literal-type-assertion */

export const stateToScheduler = (state$) =>
  state$.pipe(
    switchMap((state: ICoreState) => {
      const [er, pots, mats, press] = queriesToPipelineDebug$(state.config, true)(
        queryToStatePotentials([])
      )(stateToQueries(state));
      const err$: Observable<any> = er as Observable<any>;
      const result$ = state.stepOption === StepOption.every
        ? nextState$.pipe(
            zip(combineSchedulerObservables(err$, pots, mats, press), (_, schedule) => schedule)
          )
        : Observable.forkJoin(err$, pots, mats, press);
      return result$.pipe(map(res => [state.config, ...res]));
    })
  );
/* tslint:enable:no-object-literal-type-assertion */

const stateToQueries = (state: ICoreState): ReadonlyArray<any> => [
  ...(state.suites[state.onTestbenchQueries] || []).map(o => ({ ...o })),
];
