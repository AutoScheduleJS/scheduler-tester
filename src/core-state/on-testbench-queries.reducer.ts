import { coreStateL, ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionType } from './core.store';

export class OnTestbenchQueriesUpdateAction {
  constructor(public newSuiteIndex: number) {}
}

export type onTestbenchQueriesActionType = OnTestbenchQueriesUpdateAction;

export const onTestbenchQueriesReducer$ = (
  state: ICoreState,
  action: actionType
): ICoreState | false => {
  if (action instanceof OnTestbenchQueriesUpdateAction) {
    return handleUpdate(state, action);
  }
  return false;
};

const handleUpdate = (state: ICoreState, action: OnTestbenchQueriesUpdateAction): ICoreState => {
  return coreStateL.onTestbenchQueries.set(action.newSuiteIndex != null ? action.newSuiteIndex : 0)(
    state
  );
};
