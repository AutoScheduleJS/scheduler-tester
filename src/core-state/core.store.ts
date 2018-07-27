import { IQuery, QueryKind } from '@autoschedule/queries-fn';
import { globalUiReducer$ } from '@scheduler-tester/core-state/global.ui.reducer';
import { UIState } from '@scheduler-tester/core-state/ui.state';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { configActionType } from '@scheduler-tester/core-state/config.reducer';
import { ICoreState, StepOption } from '@scheduler-tester/core-state/core.state';
import { onTestbenchQueriesActionType } from '@scheduler-tester/core-state/on-testbench-queries.reducer';
import { onTestbenchUserstateActionType } from '@scheduler-tester/core-state/on-testbench-userstate.reducer';
import { stepOptionActionType } from '@scheduler-tester/core-state/step-option.reducer';
import { suiteActionType } from '@scheduler-tester/core-state/suites.reducer';
import { userstateActionType } from '@scheduler-tester/core-state/userstates.reducer';

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
    isNew: false,
  },
  editTab: 'qm',
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
