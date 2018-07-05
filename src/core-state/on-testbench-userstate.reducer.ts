import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { actionType } from './core.store';
import { ICoreState, coreStateL } from '@scheduler-tester/core-state/core.state';

export class OnTestbenchUserstateUpdateAction {
  constructor(public newSuiteIndex: number) {}
}

export type onTestbenchUserstateActionType = OnTestbenchUserstateUpdateAction;

export const onTestbenchUserstateReducer$ = (
  state: ICoreState,
  action: actionType
): ICoreState | false => {
  if (action instanceof OnTestbenchUserstateUpdateAction) {
    return handleUpdate(state, action);
  }
  return false;
};

const handleUpdate = (state: ICoreState, action: OnTestbenchUserstateUpdateAction): ICoreState => {
  return coreStateL.onTestbenchUserstate.set(
    action.newSuiteIndex != null ? action.newSuiteIndex : 0
  )(state);
};
