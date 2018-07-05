import { IQuery } from '@autoschedule/queries-fn';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { editTabUiReducer$ } from '@scheduler-tester/core-state/edit-tab.ui.reducer';
import { editUiReducer$ } from '@scheduler-tester/core-state/edit.ui.reducer';
import { onTestbenchQueriesReducer$ } from '@scheduler-tester/core-state/on-testbench-queries.reducer';
import { onTestbenchUserstateReducer$ } from '@scheduler-tester/core-state/on-testbench-userstate.reducer';
import { stepOptionReducer$ } from '@scheduler-tester/core-state/step-option.reducer';
import { suitesReducer$, suiteToNewQuery } from '@scheduler-tester/core-state/suites.reducer';
import { UIState } from '@scheduler-tester/core-state/ui.state';
import { userstateReducer$ } from '@scheduler-tester/core-state/userstates.reducer';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { configReducer } from './config.reducer';
import { actionType } from './core.store';

export class AddQueryAction {
  constructor() {}
}

export class UpdateQueryAction {
  constructor(public oldQuery: IQuery, public newQuery: IQuery) {}
}

export type globalUiActionType = AddQueryAction | UpdateQueryAction;

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
  if (action instanceof AddQueryAction) {
    return handleNewQuery(state);
  }
  if (action instanceof UpdateQueryAction) {
    return handleUpdateQuery(state, action);
  }
  return false;
};

const handleUpdateQuery = (state: ICoreState, action: UpdateQueryAction): ICoreState => {
  const suiteState: ICoreState = {
    ...state,
    suites: findAndUpdateSuite(state, s => {
      return s.map(query => (query === action.oldQuery ? action.newQuery : query));
    }),
  };
  const ui: UIState = {
    ...state.ui,
    edit: { query: false },
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
    editTab: 0,
    edit: {
      query: newQuery,
    },
  };
  return {
    ...suiteState,
    ui,
  };
};
