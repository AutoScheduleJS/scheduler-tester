import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { userstatesType, ICoreState, coreStateL } from './core.state';
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

export const userstateReducer$ = (state: ICoreState, action: actionType): ICoreState | false => {
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
  return false;
};

const userstateL = coreStateL.userstates;

const handleLoad = (state: ICoreState, action: UserstateLoadAction): ICoreState => {
  return userstateL.set(suites => [...suites, ...action.userstateCol])(state);
};

const handleNew = (state: ICoreState): ICoreState => {
  return userstateL.set(suites => [...suites, []])(state);
};

const mapSpecificSuite = (
  target: ReadonlyArray<IUserstateCollection>,
  fn: (s: ReadonlyArray<IUserstateCollection>) => ReadonlyArray<IUserstateCollection>
) => (suites: userstatesType) => suites.map(suite => (suite !== target ? suite : fn(suite)));

const handleQueryNew = (state: ICoreState, action: UserstateCollectionNewAction): ICoreState => {
  return userstateL.set(
    mapSpecificSuite(action.userstate, userstate => [
      ...userstate,
      { collectionName: 'collection', data: [] },
    ])
  )(state);
};

const handleQueryUpdate = (
  state: ICoreState,
  action: UserstateCollectionUpdateAction
): ICoreState => {
  return userstateL.set(
    mapSpecificSuite(action.userstate, userstate =>
      userstate.map(query => (query !== action.oldUserstate ? query : action.newUserstate))
    )
  )(state);
};
