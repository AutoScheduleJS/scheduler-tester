import 'rxjs/add/observable/zip';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { editTabUiReducer$ } from './edit-tab.ui.reducer';
import { editUiActionType, editUiReducer$ } from './edit.ui.reducer';
import { UIState } from './ui.state';

export type uiActionType = editUiActionType;

export const uiActionTrigger$: Subject<uiActionType> = new Subject();

const stateFn = (
  initialState: UIState,
  actions$: Observable<uiActionType>
): Observable<UIState> => {
  const obs: Observable<UIState> = Observable.zip(
    editUiReducer$(initialState.edit, actions$),
    editTabUiReducer$(initialState.editTab, actions$),
    (edit, editTab) => ({
      edit,
      editTab,
    })
  );

  const bs = new BehaviorSubject(initialState);
  obs.subscribe(v => bs.next(v));
  return bs;
};

const initialStateObj: UIState = {
  edit: {
    query: false,
  },
  editTab: 0,
};

export const uiState$ = stateFn(initialStateObj, uiActionTrigger$);
