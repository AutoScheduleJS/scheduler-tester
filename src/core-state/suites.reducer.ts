import { IQuery } from '@autoschedule/queries-fn';
import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { suitesType } from './core.state';
import { actionType } from './core.store';

export const suitesReducer$ = (
  init: suitesType,
  action$: Observable<actionType>
): Observable<suitesType> => {
  return action$.pipe(
    scan((state, action) => {
      return state;
    }, init)
  );
};
