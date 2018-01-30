import * as Q from '@autoschedule/queries-fn';
import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { suitesType } from './core.state';
import { actionType } from './core.store';

export interface ISuitesLoadAction {
  type: 'suitesLoad';
  queries: ReadonlyArray<ReadonlyArray<Q.IQuery>>;
}

export interface ISuitesNewAction {
  type: 'suitesNew';
}

export interface ISuitesQueryNewAction {
  type: 'suitesQueryNew';
  suite: ReadonlyArray<Q.IQuery>;
}

export interface ISuitesQueryUpdateAction {
  type: 'suitesQueryUpdate';
  suite: ReadonlyArray<Q.IQuery>;
  old: Q.IQuery;
  new: Q.IQuery;
}

export type suiteActionType =
  | ISuitesLoadAction
  | ISuitesQueryUpdateAction
  | ISuitesNewAction
  | ISuitesQueryNewAction;

export const suitesReducer$ = (
  init: suitesType,
  action$: Observable<actionType>
): Observable<suitesType> => {
  return action$.pipe(
    scan((state, action: any) => {
      switch (action.type) {
        case 'suitesLoad':
          return handleLoad(state, action);
        case 'suitesNew':
          return handleNew(state);
        case 'suitesQueryUpdate':
          return handleQueryUpdate(state, action);
        case 'suitesQueryNew':
          return handleQueryNew(state, action);
      }
      return state;
    }, init)
  );
};

const handleLoad = (state: suitesType, action: ISuitesLoadAction): suitesType => {
  return [...state, ...action.queries];
};

const handleNew = (state: suitesType): suitesType => {
  return [...state, []];
};

const mapSpecificSuite = (
  suites: ReadonlyArray<ReadonlyArray<Q.IQuery>>,
  target: ReadonlyArray<Q.IQuery>,
  fn: (s: ReadonlyArray<Q.IQuery>) => ReadonlyArray<Q.IQuery>
) => suites.map(suite => (suite !== target ? suite : fn(suite)));

const suiteToNewQuery = (suite: ReadonlyArray<Q.IQuery>): Q.IQuery => {
  const lastQuery = suite[suite.length - 1];
  return Q.queryFactory(Q.id((lastQuery ? lastQuery.id : 0) + 1));
};

const handleQueryNew = (state: suitesType, action: ISuitesQueryNewAction): suitesType => {
  return mapSpecificSuite(state, action.suite, suite => [...suite, suiteToNewQuery(suite)]);
};

const handleQueryUpdate = (state: suitesType, action: ISuitesQueryUpdateAction): suitesType => {
  return mapSpecificSuite(state, action.suite, suite =>
    suite.map(query => (query !== action.old ? query : action.new))
  );
};
