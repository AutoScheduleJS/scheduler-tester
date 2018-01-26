import { IQuery } from '@autoschedule/queries-fn';
import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { StepOption } from './core.state';
import { actionType } from './core.store';

export const onTestbenchQueriesReducer$ = (
  init: ReadonlyArray<IQuery>,
  action$: Observable<actionType>
): Observable<ReadonlyArray<IQuery>> => {
  return action$.pipe(
    scan((state, action) => {
      return state;
    }, init)
  );
};
