import { Observable } from 'rxjs/Observable';

import { scan } from 'rxjs/operators';

import { StepOption } from './core.state';
import { actionType } from './core.store';
import { IUserstateCollection } from './userstate-collection.interface';

export const onTestbenchUserstateReducer$ = (
  init: ReadonlyArray<IUserstateCollection>,
  action$: Observable<actionType>
): Observable<ReadonlyArray<IUserstateCollection>> => {
  return action$.pipe(
    scan((state, action: any) => {
      return state;
    }, init)
  );
};
