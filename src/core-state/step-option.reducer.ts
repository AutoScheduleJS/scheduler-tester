import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { StepOption, ICoreState } from './core.state';
import { actionType } from './core.store';

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
