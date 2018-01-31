import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { userstatesType } from './core.state';
import { actionType } from './core.store';
import { IUserstateCollection } from './userstate-collection.interface';

export const userstateReducer$ = (
  init: userstatesType,
  action$: Observable<actionType>
): Observable<userstatesType> => {
  return action$.pipe(
    scan((state, action: any) => {
      return state;
    }, init)
  );
};
