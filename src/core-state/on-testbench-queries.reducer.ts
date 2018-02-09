import { Observable } from 'rxjs/Observable';

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
    scan((state, action: any) => {
      if (action instanceof OnTestbenchQueriesUpdateAction) {
        return handleUpdate(action);
      }
      return state;
    }, init)
  );
};

const handleUpdate = (action: OnTestbenchQueriesUpdateAction): number => {
  return action.newSuiteIndex || -1;
};
