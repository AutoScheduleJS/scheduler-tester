import { coreStateL, ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionType } from '@scheduler-tester/core-state/core.store';

export class UpdateScrim {
  constructor(public scrim: ScrimUI) {}
}

export interface ScrimUI {
  displayScrim: boolean;
  handleClick?: () => void;
}

export type scrimUiActionType = UpdateScrim;

export const scrimUiReducer$ = (state: ICoreState, action: actionType): ICoreState | false => {
  if (action instanceof UpdateScrim) {
    return handleUpdate(state, action);
  }
  return false;
};

const handleUpdate = (state: ICoreState, action: UpdateScrim): ICoreState => {
  return coreStateL.ui.scrim.set(action.scrim)(state);
};
