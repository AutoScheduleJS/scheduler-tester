import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { StepOption } from './core.state';
import { actionType } from './core.store';

export const stepOptionReducer$ = (
  init: StepOption,
  action$: Observable<actionType>
): Observable<StepOption> => {
  return action$.pipe(
    scan((state, action) => {
      return state;
    }, init)
  );
};
