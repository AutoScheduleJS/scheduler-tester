import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { actionType } from './core.store';

export class OnTestbenchUserstateUpdateAction {
  constructor(public newSuite: number) {}
}

export type onTestbenchUserstateActionType = OnTestbenchUserstateUpdateAction;

export const onTestbenchUserstateReducer$ = (
  init: number,
  action$: Observable<actionType>
): Observable<number> => {
  return action$.pipe(
    scan((state: number, action: onTestbenchUserstateActionType) => {
      if (action instanceof OnTestbenchUserstateUpdateAction) {
        return handleUpdate(action);
      }
      return state;
    }, init)
  );
};

const handleUpdate = (action: OnTestbenchUserstateUpdateAction): number => {
  return action.newSuite != null ? action.newSuite : -1;
};
