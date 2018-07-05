import { IQuery, QueryKind } from '@autoschedule/queries-fn';
import { globalUiReducer$ } from '@scheduler-tester/core-state/global.ui.reducer';
import { UIState } from '@scheduler-tester/core-state/ui.state';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { configActionType } from './config.reducer';
import { ICoreState, StepOption } from './core.state';
import { onTestbenchQueriesActionType } from './on-testbench-queries.reducer';
import { onTestbenchUserstateActionType } from './on-testbench-userstate.reducer';
import { stepOptionActionType } from './step-option.reducer';
import { suiteActionType } from './suites.reducer';
import { userstateActionType } from './userstates.reducer';

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
  const obs: Observable<ICoreState> = globalUiReducer$(initialState, actions$);

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

const initialUIStateObj: UIState = {
  edit: {
    query: false,
  },
  editTab: 0,
};

const initialStateObj: ICoreState = {
  config: { endDate: 100, startDate: 0 },
  onTestbenchQueries: 0,
  onTestbenchUserstate: 0,
  stepOption: StepOption.last,
  suites: [initialSuite],
  userstates: [],
  ui: initialUIStateObj,
};

export const coreState$ = stateFn(initialStateObj, actionTrigger$);
