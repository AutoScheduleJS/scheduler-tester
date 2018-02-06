import { IMaterial, IPotentiality, queriesToPipelineDebug$ } from '@autoschedule/queries-scheduler';
import { queryToStatePotentials } from '@autoschedule/userstate-manager';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { VNode } from 'vue';

import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';

import { startWith, switchMap } from 'rxjs/operators';

import { ICoreState } from '../core-state/core.state';
import { coreState$ } from '../core-state/core.store';
import { IQuery } from '@autoschedule/queries-fn';

interface IScheduler {
  errors: any;
  potentials: ReadonlyArray<IPotentiality>;
  materials: ReadonlyArray<IMaterial>;
}

const computeSchedule = new BehaviorSubject<ICoreState>({
  onTestbenchQueries: -1,
  onTestbenchUserstate: -1,
  stepOption: 0,
  suites: [],
  userstates: [],
});

const cmp = {
  render(h): VNode {
    const scheduler: IScheduler = this.scheduler;
    return (
      <div>
        <div>{JSON.stringify(scheduler.errors)}</div>
        <div>{JSON.stringify(scheduler.potentials)}</div>
        <div>{JSON.stringify(scheduler.materials)}</div>
      </div>
    );
  },
  subscriptions() {
    return {
      scheduler: stateToScheduler(),
    };
  },
};

const stateToScheduler = () =>
  coreState$
    .pipe(
      switchMap((state: ICoreState) => {
        return Observable.combineLatest(
          transformWithStart(
            queriesToPipelineDebug$({ endDate: 100, startDate: 0 }, true)(
              queryToStatePotentials([])
            )(stateToQueries(state))
          ),
          (errors, potentials, materials) => ({ errors, potentials, materials })
        );
      })
    )
    .pipe(startWith({ errors: null, potentials: [], materials: [] }));

const stateToQueries = (state: ICoreState): ReadonlyArray<IQuery> => [
  ...(state.suites[state.onTestbenchQueries] || []).map(o => ({ ...o })),
];
const transformWithStart = (obs: ReadonlyArray<Observable<any> | undefined>) =>
  obs.map(ob => (!ob ? Observable.of(null) : (ob as Observable<any>).pipe(startWith(null))));
export const stDemoViewer = { name: 'st-demo-viewer', cmp };
