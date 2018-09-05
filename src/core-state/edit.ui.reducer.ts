import { IQuery } from '@autoschedule/queries-fn';
import { coreStateL, ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionType } from '@scheduler-tester/core-state/core.store';
import { IUserstateCollection } from '@scheduler-tester/core-state/userstate-collection.interface';

export class EditQueryAction {
  constructor(public query: IQuery) {}
}

export class CloseEditAction {
  constructor() {}
}

export type editUiActionType = EditQueryAction | CloseEditAction;

export interface EditUI {
  userstate: IUserstateCollection | false;
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

export const editUiL = coreStateL.ui.edit;

const handleEditQuery = (state: ICoreState, action: EditQueryAction): ICoreState => {
  return editUiL.query.set(action.query)(state);
};

const handleClose = (state: ICoreState): ICoreState => {
  return editUiL.query.set(false)(state);
};
