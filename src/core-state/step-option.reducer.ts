import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { StepOption } from './core.state';
import { actionType } from './core.store';

export class StepOptionUpdateAction {
  constructor(public value: StepOption) {}
}

export type stepOptionActionType = StepOptionUpdateAction;

export const stepOptionReducer$ = (
  init: StepOption,
  action$: Observable<actionType>
): Observable<StepOption> => {
  return action$.pipe(
    scan((state, action: any) => {
      if (action instanceof StepOptionUpdateAction) {
        return handleUpdate(action);
      }
      return state;
    }, init)
  );
};

const handleUpdate = (action: StepOptionUpdateAction): StepOption => {
  return action.value;
};
