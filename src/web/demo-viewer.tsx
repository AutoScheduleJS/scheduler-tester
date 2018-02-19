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
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';

import { switchMap, zip } from 'rxjs/operators';

import { ICoreState, StepOption } from '../core-state/core.state';
import { coreState$ } from '../core-state/core.store';

type IScheduler = [any, ReadonlyArray<IPotentiality>, ReadonlyArray<IMaterial>, ReadonlyArray<any>];

const cmp = {
  render(h): VNode {
    const data: IScheduler = this.scheduler || [];
    return (
      <div>
        <div>{displayData(data[0])}</div>
        <div>{displayData(data[1])}</div>
        <div>{displayData(data[2])}</div>
        <div>{displayData(data[3])}</div>
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

const displayData = (data: any) => {
  const val = data || {};
  return JSON.stringify(val);
}

const nextState$ = new Subject<never>();

/* tslint:disable:no-object-literal-type-assertion */

const stateToScheduler = () =>
  coreState$.pipe(
    switchMap((state: ICoreState) => {
      const [er, pots, mats, press] = queriesToPipelineDebug$({ endDate: 100, startDate: 0 }, true)(
        queryToStatePotentials([])
      )(stateToQueries(state));
      const err$: Observable<any> = er as Observable<any>;
      return state.stepOption === StepOption.every
        ? nextState$.pipe(
            zip(combineSchedulerObservables(err$, pots, mats, press), (_, schedule) => schedule)
          )
        : Observable.forkJoin(err$, pots, mats, press);
    })
  );
/* tslint:enable:no-object-literal-type-assertion */

const stateToQueries = (state: ICoreState): ReadonlyArray<IQuery> => [
  ...(state.suites[state.onTestbenchQueries] || []).map(o => ({ ...o })),
];

export const stDemoViewer = { name: 'st-demo-viewer', cmp };
