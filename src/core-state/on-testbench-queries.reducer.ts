import { IQuery } from '@autoschedule/queries-fn';
import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { actionType } from './core.store';

export class OnTestbenchQueriesUpdateAction {
  constructor(public newSuite: ReadonlyArray<IQuery>) {}
}

export type onTestbenchQueriesActionType = OnTestbenchQueriesUpdateAction;

export const onTestbenchQueriesReducer$ = (
  init: ReadonlyArray<IQuery>,
  action$: Observable<actionType>
): Observable<ReadonlyArray<IQuery>> => {
  return action$.pipe(
    scan((state, action: any) => {
      if (action instanceof OnTestbenchQueriesUpdateAction) {
        return handleUpdate(action);
      }
      return state;
    }, init)
  );
};

const handleUpdate = (action: OnTestbenchQueriesUpdateAction): ReadonlyArray<IQuery> => {
  return action.newSuite || [];
};
