import { IQuery } from '@autoschedule/queries-fn';
import {
  combineSchedulerObservables,
  IMaterial,
  IPotentiality,
  queriesToPipelineDebug$,
} from '@autoschedule/queries-scheduler';
import { queryToStatePotentials } from '@autoschedule/userstate-manager';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { VNode } from 'vue';

import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';

import { switchMap, zip } from 'rxjs/operators';

import { ICoreState } from '../core-state/core.state';
import { coreState$ } from '../core-state/core.store';

type IScheduler = [
  any,
  ReadonlyArray<IPotentiality>,
  ReadonlyArray<IMaterial>,
  ReadonlyArray<any>
];

const cmp = {
  render(h): VNode {
    this.scheduler = this.scheduler || {};
    Object.defineProperty(this.scheduler, 'nested', { configurable: false });
    const scheduler: IScheduler = this.scheduler;
    return (
      <div>
        <div>{JSON.stringify(scheduler[0] || {})}</div>
        <div>{JSON.stringify(scheduler[1] || [])}</div>
        <div>{JSON.stringify(scheduler[2] || [])}</div>
        <div>{JSON.stringify(scheduler[3] || [])}</div>
        <button onClick={() => nextState$.next()}>NEXT</button>
      </div>
    );
  },
  subscriptions() {
    return {
      scheduler: stateToScheduler(),
    };
  },
};

const nextState$ = new Subject<never>();

/* tslint:disable:no-object-literal-type-assertion */

const stateToScheduler = () =>
  coreState$.pipe(
    switchMap((state: ICoreState) => {
      const [er, pots, mats, press] = queriesToPipelineDebug$({ endDate: 100, startDate: 0 }, true)(
        queryToStatePotentials([])
      )(stateToQueries(state));
      return nextState$.pipe(
        zip(
          combineSchedulerObservables(er as Observable<any>, pots, mats, press),
          (_, schedule) => schedule
        )
      );
    })
  );
/* tslint:enable:no-object-literal-type-assertion */

const stateToQueries = (state: ICoreState): ReadonlyArray<IQuery> => [
  ...(state.suites[state.onTestbenchQueries] || []).map(o => ({ ...o })),
];

export const stDemoViewer = { name: 'st-demo-viewer', cmp };
