import { IQuery, QueryKind } from '@autoschedule/queries-fn';
import { BehaviorSubject, Observable, Subject, zip } from 'rxjs';
import { configActionType, configReducer$ } from './config.reducer';
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
  | configActionType
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
  const obs: Observable<ICoreState> = zip(
    configReducer$(initialState.config, actions$),
    suitesReducer$(initialState.suites, actions$),
    userstateReducer$(initialState.userstates, actions$),
    stepOptionReducer$(initialState.stepOption, actions$),
    onTestbenchUserstateReducer$(initialState.onTestbenchUserstate, actions$),
    onTestbenchQueriesReducer$(initialState.onTestbenchQueries, actions$),
    (config, suites, userstates, stepOption, onTestbenchUserstate, onTestbenchQueries) => ({
      config,
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

const initialSuite: ReadonlyArray<IQuery> = [
  {
    id: 1,
    kind: QueryKind.Atomic,
    name: 'First Query',
    position: { duration: { min: 2, target: 4 } },
    splittable: false,
  },
];

const initialStateObj: ICoreState = {
  config: { endDate: 100, startDate: 0 },
  onTestbenchQueries: 0,
  onTestbenchUserstate: 0,
  stepOption: StepOption.last,
  suites: [initialSuite],
  userstates: [],
};

export const coreState$ = stateFn(initialStateObj, actionTrigger$);
