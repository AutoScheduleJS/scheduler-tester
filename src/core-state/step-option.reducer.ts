import { ICoreState, StepOption } from '@scheduler-tester/core-state/core.state';
import { actionType } from '@scheduler-tester/core-state/core.store';

export class StepOptionUpdateAction {
  constructor(public value: StepOption) {}
}

export type stepOptionActionType = StepOptionUpdateAction;

export const stepOptionReducer$ = (state: ICoreState, action: actionType): ICoreState | false => {
  if (action instanceof StepOptionUpdateAction) {
    return handleUpdate(state, action);
  }
  return false;
};

const handleUpdate = (state: ICoreState, action: StepOptionUpdateAction): ICoreState => {
  return {
    ...state,
    stepOption: action.value,
  };
};
