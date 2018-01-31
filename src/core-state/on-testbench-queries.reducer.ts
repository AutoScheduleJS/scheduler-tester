import { IQuery } from '@autoschedule/queries-fn';
import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { actionType } from './core.store';

export class OnTestbenchUpdateAction {
  constructor(public newSuite: ReadonlyArray<IQuery>) {}
}

export const onTestbenchQueriesReducer$ = (
  init: ReadonlyArray<IQuery>,
  action$: Observable<actionType>
): Observable<ReadonlyArray<IQuery>> => {
  return action$.pipe(
    scan((state, action: any) => {
      if (action instanceof OnTestbenchUpdateAction) {
        return handleUpdate(action);
      }
      return state;
    }, init)
  );
};

const handleUpdate = (action: OnTestbenchUpdateAction): ReadonlyArray<IQuery> => {
  return action.newSuite;
}