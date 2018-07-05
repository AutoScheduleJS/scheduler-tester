import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionType } from '@scheduler-tester/core-state/core.store';
import { IConfig } from './config.interface';

export class ConfigUpdateAction {
  constructor(public newConfig: IConfig) {}
}

export type configActionType = ConfigUpdateAction;

export const configReducer = (state: ICoreState, action: actionType): ICoreState | false => {
  if (action instanceof ConfigUpdateAction) {
    return handleUpdate(state, action);
  }
  return false;
};

export const handleUpdate = (state: ICoreState, action: ConfigUpdateAction): ICoreState => {
  return {
    ...state,
    config: action.newConfig,
  };
};
