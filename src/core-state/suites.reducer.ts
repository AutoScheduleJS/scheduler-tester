import * as Q from '@autoschedule/queries-fn';
import { coreStateL, ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionType } from '@scheduler-tester/core-state/core.store';

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
  constructor(public suite: ReadonlyArray<Q.IQuery>, public oldQuery: Q.IQuery) {}
}

/* tslint:enable:no-empty */

export type suiteActionType =
  | SuitesLoadAction
  | SuitesNewAction
  | SuitesQueryNewAction
  | SuitesQueryUpdateAction
  | SuitesQueryDeleteAction;

export const suitesReducer$ = (state: ICoreState, action: actionType): ICoreState | false => {
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
  return false;
};

const suitesL = coreStateL.suites;

const handleLoad = (state: ICoreState, action: SuitesLoadAction): ICoreState => {
  return suitesL.set(suites => [...suites, ...action.queries])(state);
};

const handleNew = (state: ICoreState): ICoreState => {
  return suitesL.set(suites => [...suites, []])(state);
};

const mapSpecificSuite = (
  target: ReadonlyArray<Q.IQuery>,
  fn: (s: ReadonlyArray<Q.IQuery>) => ReadonlyArray<Q.IQuery>
) => (suites: ReadonlyArray<ReadonlyArray<Q.IQuery>>) =>
  suites.map(suite => (suite !== target ? suite : fn(suite)));

export const suiteToNewQuery = (suite: ReadonlyArray<Q.IQuery>): Q.IQuery => {
  const lastQuery = suite[suite.length - 1];
  return Q.queryFactory(
    Q.id((lastQuery ? lastQuery.id : 0) + 1),
    Q.positionHelper(Q.start(1), Q.end(5), Q.duration(4, 2))
  );
};

const handleQueryNew = (state: ICoreState, action: SuitesQueryNewAction): ICoreState => {
  return suitesL.set(mapSpecificSuite(action.suite, suite => [...suite, suiteToNewQuery(suite)]))(
    state
  );
};

const handleQueryDelete = (state: ICoreState, action: SuitesQueryDeleteAction): ICoreState => {
  return suitesL.set(
    mapSpecificSuite(action.suite, suite => suite.filter(q => q !== action.oldQuery))
  )(state);
};

const handleQueryUpdate = (state: ICoreState, action: SuitesQueryUpdateAction): ICoreState => {
  return suitesL.set(
    mapSpecificSuite(action.suite, suite =>
      suite.map(query => (query !== action.oldQuery ? query : Q.sanitize(action.newQuery)))
    )
  )(state);
};
