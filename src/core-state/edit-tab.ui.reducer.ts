import { ICoreState, coreStateL } from '@scheduler-tester/core-state/core.state';
import { actionType } from '@scheduler-tester/core-state/core.store';

export class UpdateEditTab {
  constructor(public id: TabId) {}
}

export enum TabId {
  Queries,
  Userstates,
}

export type editTabUiActionType = UpdateEditTab;

export const editTabUiReducer$ = (state: ICoreState, action: actionType): ICoreState | false => {
  if (action instanceof UpdateEditTab) {
    return handleUpdate(state, action);
  }
  return false;
};

const handleUpdate = (state: ICoreState, action: UpdateEditTab): ICoreState => {
  return coreStateL.ui.editTab.set(action.id)(state);
};
