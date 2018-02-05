import { IMaterial, IPotentiality, queriesToPipelineDebug$ } from '@autoschedule/queries-scheduler';
import { queryToStatePotentials } from '@autoschedule/userstate-manager';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { VNode } from 'vue';

import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';

import { mergeMap, startWith, switchMap } from 'rxjs/operators';

import { ICoreState } from '../core-state/core.state';

interface IScheduler {
  errors: any;
  potentials: ReadonlyArray<IPotentiality>;
  materials: ReadonlyArray<IMaterial>;
}

const computeSchedule = new BehaviorSubject<ICoreState>({
  onTestbenchQueries: [],
  onTestbenchUserstate: [],
  stepOption: 0,
  suites: [],
  userstates: [],
});

const cmp = {
  props: ['state'],
  render(h): VNode {
    const scheduler: IScheduler = this.scheduler;
    const state = this.state;
    return (
      <div>
        <button onClick={() => computeSchedule.next(state)}>GET SCHEDULE</button>
        <div>{JSON.stringify(scheduler.errors)}</div>
        <div>{JSON.stringify(scheduler.potentials)}</div>
        <div>{JSON.stringify(scheduler.materials)}</div>
      </div>
    );
  },
  subscriptions() {
    return {
      scheduler: stateToScheduler(computeSchedule),
    };
  },
};

const stateToScheduler = (computeSignal$: Observable<ICoreState>) =>
  computeSignal$
    .pipe(
      switchMap(state =>
        Observable.combineLatest(
          transformWithStart(
            queriesToPipelineDebug$({ endDate: 100, startDate: 0 }, true)(
              queryToStatePotentials([])
            )([...state.onTestbenchQueries.map(o => ({ ...o }))])
          ),
          (errors, potentials, materials) => ({ errors, potentials, materials })
        )
      )
    )
    .pipe(startWith({ errors: null, potentials: [], materials: [] }));

const transformWithStart = (obs: ReadonlyArray<Observable<any> | undefined>) =>
  obs.map(ob => (!ob ? Observable.of(null) : (ob as Observable<any>).pipe(startWith(null))));
export const stDemoViewer = { name: 'st-demo-viewer', cmp };
