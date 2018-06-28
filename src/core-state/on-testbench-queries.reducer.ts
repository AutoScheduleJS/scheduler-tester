import { Observable } from 'rxjs';

import { scan } from 'rxjs/operators';

import { actionType } from './core.store';

export class OnTestbenchQueriesUpdateAction {
  constructor(public newSuiteIndex: number) {}
}

export type onTestbenchQueriesActionType = OnTestbenchQueriesUpdateAction;

export const onTestbenchQueriesReducer$ = (
  init: number,
  action$: Observable<actionType>
): Observable<number> => {
  return action$.pipe(
    scan((state: number, action: onTestbenchQueriesActionType) => {
      if (action instanceof OnTestbenchQueriesUpdateAction) {
        return handleUpdate(action);
      }
      return state;
    }, init)
  );
};

const handleUpdate = (action: OnTestbenchQueriesUpdateAction): number => {
  return action.newSuiteIndex != null ? action.newSuiteIndex : -1;
};
