import * as Q from '@autoschedule/queries-fn';
import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { suitesType } from './core.state';
import { actionType } from './core.store';

/* tslint:disable:no-empty max-classes-per-file */

export class SuitesLoadAction {
  constructor(public queries: ReadonlyArray<ReadonlyArray<Q.IQuery>>) {}
}

export class SuitesNewAction {
  constructor() {}
}

export class SuitesQueryNewAction {
  constructor(public suite: ReadonlyArray<Q.IQuery>) {}
}

export class SuitesQueryUpdateAction {
  constructor(
    public suite: ReadonlyArray<Q.IQuery>,
    public oldQuery: Q.IQuery,
    public newQuery: Q.IQuery
  ) {}
}

export class SuitesQueryDeleteAction {
  constructor(
    public suite: ReadonlyArray<Q.IQuery>,
    public oldQuery: Q.IQuery
  ) {}
}

/* tslint:enable:no-empty */

export type suiteActionType =
  | SuitesLoadAction
  | SuitesNewAction
  | SuitesQueryNewAction
  | SuitesQueryUpdateAction
  | SuitesQueryDeleteAction;

export const suitesReducer$ = (
  init: suitesType,
  action$: Observable<actionType>
): Observable<suitesType> => {
  return action$.pipe(
    scan((state, action: any) => {
      if (action instanceof SuitesLoadAction) {
        return handleLoad(state, action);
      }
      if (action instanceof SuitesQueryUpdateAction) {
        return handleQueryUpdate(state, action);
      }
      if (action instanceof SuitesNewAction) {
        return handleNew(state);
      }
      if (action instanceof SuitesQueryNewAction) {
        return handleQueryNew(state, action);
      }
      if (action instanceof SuitesQueryDeleteAction) {
        return handleQueryDelete(state, action);
      }
      return state;
    }, init)
  );
};

const handleLoad = (state: suitesType, action: SuitesLoadAction): suitesType => {
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
  return Q.queryFactory(
    Q.id((lastQuery ? lastQuery.id : 0) + 1),
    Q.start(1),
    Q.end(5),
    Q.duration(Q.timeDuration(4, 2)),
    Q.transforms([Q.need()], [], [])
  );
};

const handleQueryNew = (state: suitesType, action: SuitesQueryNewAction): suitesType => {
  return mapSpecificSuite(state, action.suite, suite => [...suite, suiteToNewQuery(suite)]);
};

const handleQueryDelete = (state: suitesType, action: SuitesQueryDeleteAction): suitesType => {
  return mapSpecificSuite(state, action.suite, suite => suite.filter(q => q !== action.oldQuery));
};

const handleQueryUpdate = (state: suitesType, action: SuitesQueryUpdateAction): suitesType => {
  return mapSpecificSuite(state, action.suite, suite =>
    suite.map(query => (query !== action.oldQuery ? query : Q.sanitize(action.newQuery)))
  );
};
