import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/zip';

import { ICoreState, StepOption } from './core.state';

import {
  onTestbenchQueriesActionType,
  onTestbenchQueriesReducer$,
} from './on-testbench-queries.reducer';
import {
  onTestbenchUserstateActionType,
  onTestbenchUserstateReducer$,
} from './on-testbench-userstate.reducer';
import { stepOptionActionType, stepOptionReducer$ } from './step-option.reducer';
import { suiteActionType, suitesReducer$ } from './suites.reducer';
import { userstateActionType, userstateReducer$ } from './userstates.reducer';

export type actionType =
  | suiteActionType
  | userstateActionType
  | stepOptionActionType
  | onTestbenchQueriesActionType
  | onTestbenchUserstateActionType;

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
  onTestbenchQueries: -1,
  onTestbenchUserstate: -1,
  stepOption: StepOption.last,
  suites: [],
  userstates: [],
};

export const coreState$ = stateFn(initialStateObj, actionTrigger$);
