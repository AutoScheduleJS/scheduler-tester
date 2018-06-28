import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { actionType } from './core.store';

export class UpdateEditTab {
  constructor(public index: number) {}
}

export type editTabUiActionType = UpdateEditTab;

export const editTabUiReducer$ = (
  init: number,
  action$: Observable<actionType>
): Observable<number> => {
  return action$.pipe(
    scan((state: number, action: actionType) => {
      if (action instanceof UpdateEditTab) {
        return handleUpdate(action);
      }
      return state;
    }, init)
  );
};

const handleUpdate = (action: UpdateEditTab): number => {
  return action.index;
};
