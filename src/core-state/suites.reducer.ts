import { IQuery } from '@autoschedule/queries-fn';
import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { suitesType } from './core.state';
import { actionType } from './core.store';

export interface ISuitesLoadAction {
  type: 'load';
  queries: ReadonlyArray<ReadonlyArray<IQuery>>;
}

export type suiteActionType = ISuitesLoadAction;

export const suitesReducer$ = (
  init: suitesType,
  action$: Observable<actionType>
): Observable<suitesType> => {
  return action$.pipe(
    scan((state, action: any) => {
      switch (action.type) {
        case 'load':
          return handleLoad(state, action);
      }
      return state;
    }, init)
  );
};

const handleLoad = (state: suitesType, action: ISuitesLoadAction): suitesType => {
  return [...state, ...action.queries];
};
