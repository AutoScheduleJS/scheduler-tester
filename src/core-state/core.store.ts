import { IQuery, QueryKind } from '@autoschedule/queries-fn';
import { BehaviorSubject, Observable, Subject, zip } from 'rxjs';
import { configActionType, configReducer$ } from './config.reducer';
import { ICoreState, StepOption, suitesType, userstatesType } from './core.state';
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
import { UIState } from '@scheduler-tester/core-state/ui.state';
import { editUiReducer$, EditUI } from '@scheduler-tester/core-state/edit.ui.reducer';
import { editTabUiReducer$ } from '@scheduler-tester/core-state/edit-tab.ui.reducer';
import { globalUiReducer$ } from '@scheduler-tester/core-state/global.ui.reducer';
import { withLatestFrom, map } from 'rxjs/operators';

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
    editUiReducer$(initialState.ui.edit, actions$),
    editTabUiReducer$(initialState.ui.editTab, actions$),
    (
      config,
      suites: suitesType,
      userstates: userstatesType,
      stepOption: StepOption,
      onTestbenchUserstate: number,
      onTestbenchQueries: number,
      edit: EditUI,
      editTab: number,
    ) => ({
      config,
      onTestbenchQueries,
      onTestbenchUserstate,
      stepOption,
      suites,
      userstates,
      ui: {
        edit,
        editTab,
      },
    })
  );

  const bs = new BehaviorSubject(initialState);
  obs.pipe(withLatestFrom(actions$), map(globalUiReducer$)).subscribe(v => bs.next(v));
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
