import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/zip';

import { ICoreState, StepOption } from './core.state';

import { onTestbenchQueriesReducer$ } from './on-testbench-queries.reducer';
import { onTestbenchUserstateReducer$ } from './on-testbench-userstate.reducer';
import { stepOptionReducer$ } from './step-option.reducer';
import { suitesReducer$ } from './suites.reducer';
import { userstateReducer$ } from './userstates.reducer';

export type actionType = any;

export const actionTrigger$: Subject<actionType> = new Subject();

const stateFn = (
  initialState: ICoreState,
  actions$: Observable<actionType>
): Observable<ICoreState> => {
  const obs: Observable<ICoreState> = Observable.zip(
    suitesReducer$(initialState.suites, actions$),
    userstateReducer$(initialState.userstates, actions$),
    stepOptionReducer$(initialState.stepOption, actions$),
    onTestbenchUserstateReducer$(initialState.onTestbenchUserstate, actions$),
    onTestbenchQueriesReducer$(initialState.onTestbenchQueries, actions$),
    (suites, userstates, stepOption, onTestbenchUserstate, onTestbenchQueries) => ({
      onTestbenchQueries,
      onTestbenchUserstate,
      stepOption,
      suites,
      userstates,
    })
  );

  const bs = new BehaviorSubject(initialState);
  obs.subscribe(v => bs.next(v));
  return bs;
};

const initialStateObj: ICoreState = {
  onTestbenchQueries: [],
  onTestbenchUserstate: [],
  stepOption: StepOption.every,
  suites: [],
  userstates: [],
}

export const coreState$ = stateFn(initialStateObj, actionTrigger$);
