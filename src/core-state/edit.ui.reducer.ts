import { IQuery } from '@autoschedule/queries-fn';
import { ICoreState, coreStateL } from '@scheduler-tester/core-state/core.state';
import { actionType } from './core.store';

export class EditQueryAction {
  constructor(public query: IQuery) {}
}

export class CloseEditAction {
  constructor() {}
}

export type editUiActionType = EditQueryAction | CloseEditAction;

export interface EditUI {
  query: IQuery | false;
  isNew: boolean;
}

export const editUiReducer$ = (state: ICoreState, action: actionType): ICoreState | false => {
  if (action instanceof EditQueryAction) {
    return handleEditQuery(state, action);
  }
  if (action instanceof CloseEditAction) {
    return handleClose(state);
  }
  return false;
};

const editUiL = coreStateL.ui.edit;

const handleEditQuery = (state: ICoreState, action: EditQueryAction): ICoreState => {
  return editUiL.query.set(action.query)(state);
};

const handleClose = (state: ICoreState): ICoreState => {
  return editUiL.query.set(false)(state);
};
