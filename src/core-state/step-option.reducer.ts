import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { StepOption } from './core.state';
import { actionType } from './core.store';

export class StepoptionUpdateAction {
  constructor(public value: StepOption) {}
}

export type stepOptionActionType = StepoptionUpdateAction;

export const stepOptionReducer$ = (
  init: StepOption,
  action$: Observable<actionType>
): Observable<StepOption> => {
  return action$.pipe(
    scan((state, action: any) => {
      if (action instanceof StepoptionUpdateAction) {
        return handleUpdate(action);
      }
      return state;
    }, init)
  );
};

const handleUpdate = (action: StepoptionUpdateAction): StepOption => {
  return action.value;
};
