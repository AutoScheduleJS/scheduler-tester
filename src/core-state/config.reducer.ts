import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { IConfig } from './config.interface';
import { actionType } from './core.store';

export class ConfigUpdateAction {
  constructor(public newConfig: IConfig) {}
}

export type configActionType = ConfigUpdateAction;

export const configReducer$ = (
  init: IConfig,
  action$: Observable<actionType>
): Observable<IConfig> => {
  return action$.pipe(
    scan((state: IConfig, action: configActionType) => {
      if (action instanceof ConfigUpdateAction) {
        return handleUpdate(action);
      }
      return state;
    }, init)
  );
};

const handleUpdate = (action: ConfigUpdateAction): IConfig => {
  return action.newConfig;
};
