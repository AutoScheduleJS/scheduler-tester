import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { actionType } from './core.store';
import { IUserstateCollection } from './userstate-collection.interface';

export class OnTestbenchUserstateUpdateAction {
  constructor(public newSuite: ReadonlyArray<IUserstateCollection>) {}
}

export type onTestbenchUserstateActionType = OnTestbenchUserstateUpdateAction;

export const onTestbenchUserstateReducer$ = (
  init: number,
  action$: Observable<actionType>
): Observable<number> => {
  return action$.pipe(
    scan((state, action: any) => {
      if (action instanceof OnTestbenchUserstateUpdateAction) {
        return handleUpdate(action);
      }
      return state;
    }, init)
  );
};

const handleUpdate = (action: OnTestbenchUserstateUpdateAction): ReadonlyArray<IUserstateCollection> => {
  return action.newSuite || [];
};
