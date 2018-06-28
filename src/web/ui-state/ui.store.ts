import { BehaviorSubject, Observable, Subject, zip } from 'rxjs';
import { editTabUiReducer$ } from './edit-tab.ui.reducer';
import { editUiActionType, editUiReducer$ } from './edit.ui.reducer';
import { UIState } from './ui.state';

export type uiActionType = editUiActionType;

export const uiActionTrigger$: Subject<uiActionType> = new Subject();

const stateFn = (
  initialState: UIState,
  actions$: Observable<uiActionType>
): Observable<UIState> => {
  const obs: Observable<UIState> = zip(
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
