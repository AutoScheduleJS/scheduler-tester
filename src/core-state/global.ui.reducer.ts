import { configReducer } from '@scheduler-tester/core-state/config.reducer';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionType } from '@scheduler-tester/core-state/core.store';
import { editTabUiReducer$, TabId } from '@scheduler-tester/core-state/edit-tab.ui.reducer';
import { editUiReducer$ } from '@scheduler-tester/core-state/edit.ui.reducer';
import { onTestbenchQueriesReducer$ } from '@scheduler-tester/core-state/on-testbench-queries.reducer';
import { onTestbenchUserstateReducer$ } from '@scheduler-tester/core-state/on-testbench-userstate.reducer';
import { stepOptionReducer$ } from '@scheduler-tester/core-state/step-option.reducer';
import { suitesReducer$, suiteToNewQuery } from '@scheduler-tester/core-state/suites.reducer';
import { UIState } from '@scheduler-tester/core-state/ui.state';
import { userstateReducer$ } from '@scheduler-tester/core-state/userstates.reducer';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { IQuery, sanitize } from '@autoschedule/queries-fn';
import { IUserstateCollection } from '@scheduler-tester/core-state/userstate-collection.interface';

export class AddItemAction {
  constructor() {}
}

export class AddQueryAction {
  constructor() {}
}

export class UpdateQueryAction {
  constructor(public oldQuery: IQuery, public newQuery: IQuery) {}
}

export class DeleteQueryAction {
  constructor(public query: IQuery) {}
}

export class AddUserstateAction {
  constructor() {}
}

export class UpdateUserstateAction {
  constructor(
    public oldUserstate: IUserstateCollection,
    public newUserstate: IUserstateCollection
  ) {}
}

export class DeleteUserstateAction {
  constructor(public collection: IUserstateCollection) {}
}

export type globalUiActionType =
  | AddItemAction
  | AddQueryAction
  | UpdateQueryAction
  | DeleteQueryAction
  | AddUserstateAction
  | UpdateUserstateAction
  | DeleteUserstateAction;

export const globalUiReducer$ = (
  init: ICoreState,
  action$: Observable<actionType>
): Observable<ICoreState> => {
  return action$.pipe(
    scan((state: ICoreState, action: actionType) => {
      const reducers = [
        configReducer,
        editTabUiReducer$,
        editUiReducer$,
        onTestbenchQueriesReducer$,
        onTestbenchUserstateReducer$,
        stepOptionReducer$,
        suitesReducer$,
        userstateReducer$,
        globalReducer,
      ];
      let res: false | ICoreState = false;
      while (!res) {
        const reducer = reducers.pop();
        if (!reducer) {
          return state;
        }
        res = reducer(state, action);
      }
      return res;
    }, init)
  );
};

const globalReducer = (state: ICoreState, action: actionType): ICoreState | false => {
  if (action instanceof AddItemAction) {
    return handleNewItem(state);
  }
  if (action instanceof AddQueryAction) {
    return handleNewQuery(state);
  }
  if (action instanceof UpdateQueryAction) {
    return handleUpdateQuery(state, action);
  }
  if (action instanceof DeleteQueryAction) {
    return handleDeleteQuery(state, action);
  }
  if (action instanceof AddUserstateAction) {
    return handleNewUserstate(state);
  }
  if (action instanceof UpdateUserstateAction) {
    return handleUpdateUserstate(state, action);
  }
  if (action instanceof DeleteUserstateAction) {
    return handleDeleteUserstate(state, action);
  }
  return false;
};

const handleUpdateQuery = (state: ICoreState, action: UpdateQueryAction): ICoreState => {
  const internalQuery = sanitize(action.newQuery);
  const suiteState: ICoreState = {
    ...state,
    suites: findAndUpdateSuite(state, s => {
      return s.map(query => (query === action.oldQuery ? internalQuery : query));
    }),
  };
  const ui: UIState = {
    ...state.ui,
    edit: { userstate: false, query: false, isNew: false },
  };
  return {
    ...suiteState,
    ui,
  };
};

const deleteFromArr = <T>(fn: (a: T) => boolean, arr: ReadonlyArray<T>): Array<T> => {
  const i = arr.findIndex(fn);
  const res = [...arr];
  res.splice(i, 1);
  return res;
};

const handleDeleteQuery = (state: ICoreState, action: DeleteQueryAction): ICoreState => {
  const suiteState: ICoreState = {
    ...state,
    suites: findAndUpdateSuite(state, s => {
      return deleteFromArr(query => query === action.query, s);
    }),
  };
  const ui: UIState = {
    ...state.ui,
    edit: { userstate: false, query: false, isNew: false },
  };
  return {
    ...suiteState,
    ui,
  };
};

const findAndUpdateSuite = (
  state: ICoreState,
  updateSuite: (suite: ReadonlyArray<IQuery>) => ReadonlyArray<IQuery>
): ReadonlyArray<ReadonlyArray<IQuery>> => {
  return state.suites.map((s, i) => {
    if (i !== state.onTestbenchQueries) {
      return s;
    }
    return updateSuite(s);
  });
};

const findAndUpdateCollections = (
  state: ICoreState,
  updateCollections: (
    suite: ReadonlyArray<IUserstateCollection>
  ) => ReadonlyArray<IUserstateCollection>
): ReadonlyArray<ReadonlyArray<IUserstateCollection>> => {
  return state.userstates.map((s, i) => {
    if (i !== state.onTestbenchUserstate) {
      return s;
    }
    return updateCollections(s);
  });
};

const handleNewItem = (state: ICoreState): ICoreState => {
  if (state.ui.editTab === TabId.Queries) {
    return handleNewQuery(state);
  }
  if (state.ui.editTab === TabId.Userstates) {
    return handleNewUserstate(state);
  }
  return state;
};

const handleNewQuery = (state: ICoreState): ICoreState => {
  var newQuery: IQuery | false = false;
  const suiteState: ICoreState = {
    ...state,
    suites: findAndUpdateSuite(state, s => {
      newQuery = suiteToNewQuery(s);
      return [...s, newQuery];
    }),
  };
  const ui: UIState = {
    editTab: TabId.Queries,
    edit: {
      userstate: false,
      query: newQuery,
      isNew: true,
    },
  };
  return {
    ...suiteState,
    ui,
  };
};

const handleNewUserstate = (state: ICoreState): ICoreState => {
  var newUserstate: IUserstateCollection | false = false;
  const suiteState: ICoreState = {
    ...state,
    userstates: findAndUpdateCollections(state, s => {
      newUserstate = { collectionName: 'New Collection', data: [] };
      return [...s, newUserstate];
    }),
  };
  const ui: UIState = {
    editTab: TabId.Userstates,
    edit: { userstate: newUserstate, query: false, isNew: true },
  };
  return {
    ...suiteState,
    ui,
  };
};

const handleUpdateUserstate = (state: ICoreState, action: UpdateUserstateAction): ICoreState => {
  const internalQuery = action.newUserstate;
  const suiteState: ICoreState = {
    ...state,
    userstates: findAndUpdateCollections(state, s => {
      return s.map(collection => (collection === action.oldUserstate ? internalQuery : collection));
    }),
  };
  const ui: UIState = {
    ...state.ui,
    edit: { userstate: false, query: false, isNew: false },
  };
  return {
    ...suiteState,
    ui,
  };
};

const handleDeleteUserstate = (state: ICoreState, action: DeleteUserstateAction): ICoreState => {
  const suiteState: ICoreState = {
    ...state,
    userstates: findAndUpdateCollections(state, s => {
      return deleteFromArr(collection => collection === action.collection, s);
    }),
  };
  const ui: UIState = {
    ...state.ui,
    edit: { userstate: false, query: false, isNew: false },
  };
  return {
    ...suiteState,
    ui,
  };
};
