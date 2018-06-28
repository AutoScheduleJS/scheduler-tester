import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { userstatesType } from './core.state';
import { actionType } from './core.store';
import { IUserstateCollection } from './userstate-collection.interface';

/* tslint:disable:no-empty max-classes-per-file */

export class UserstateLoadAction {
  constructor(public userstateCol: userstatesType) {}
}

export class UserstateNewAction {
  constructor() {}
}

export class UserstateCollectionNewAction {
  constructor(public userstate: ReadonlyArray<IUserstateCollection>) {}
}

export class UserstateCollectionUpdateAction {
  constructor(
    public userstate: ReadonlyArray<IUserstateCollection>,
    public oldUserstate: IUserstateCollection,
    public newUserstate: IUserstateCollection
  ) {}
}

/* tslint:enable:no-empty */

export type userstateActionType =
  | UserstateLoadAction
  | UserstateCollectionUpdateAction
  | UserstateNewAction
  | UserstateCollectionNewAction;

export const userstateReducer$ = (
  init: userstatesType,
  action$: Observable<actionType>
): Observable<userstatesType> => {
  return action$.pipe(
    scan((state: userstatesType, action: userstateActionType) => {
      if (action instanceof UserstateLoadAction) {
        return handleLoad(state, action);
      }
      if (action instanceof UserstateCollectionUpdateAction) {
        return handleQueryUpdate(state, action);
      }
      if (action instanceof UserstateNewAction) {
        return handleNew(state);
      }
      if (action instanceof UserstateCollectionNewAction) {
        return handleQueryNew(state, action);
      }
      return state;
    }, init)
  );
};

const handleLoad = (state: userstatesType, action: UserstateLoadAction): userstatesType => {
  return [...state, ...action.userstateCol];
};

const handleNew = (state: userstatesType): userstatesType => {
  return [...state, []];
};

const mapSpecificSuite = (
  suites: userstatesType,
  target: ReadonlyArray<IUserstateCollection>,
  fn: (s: ReadonlyArray<IUserstateCollection>) => ReadonlyArray<IUserstateCollection>
) => suites.map(suite => (suite !== target ? suite : fn(suite)));

const handleQueryNew = (
  state: userstatesType,
  action: UserstateCollectionNewAction
): userstatesType => {
  return mapSpecificSuite(state, action.userstate, userstate => [
    ...userstate,
    { collectionName: 'collection', data: [] },
  ]);
};

const handleQueryUpdate = (
  state: userstatesType,
  action: UserstateCollectionUpdateAction
): userstatesType => {
  return mapSpecificSuite(state, action.userstate, userstate =>
    userstate.map(query => (query !== action.oldUserstate ? query : action.newUserstate))
  );
};
