import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { ICoreState } from '../../../core-state/core.state';
import { actionType } from '../../../core-state/core.store';

export const connect = (
  selector: (s: ICoreState) => any = state => state,
  actionSubject: Subject<actionType>
) => {
  const action = { action: (val: actionType) => actionSubject.next(val) };

  return WrappedComponent => {
    return class Connect extends React.Component<{ state$: Observable<ICoreState> }> {
      private subscription;
      public componentWillMount() {
        this.subscription = this.props.state$
          .pipe(map(selector))
          .subscribe(this.setState.bind(this));
      }

      public componentWillUnmount() {
        this.subscription.unsubscribe();
      }

      public render() {
        return <WrappedComponent {...this.state} {...this.props} {...action} />;
      }
    };
  };
};
