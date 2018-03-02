import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { actionType } from '@scheduler-tester/core-state/core.store';

export const connect = (
  selector: (s: any) => any = state => state,
  actionSubject?: Subject<actionType>
) => {
  const action = actionSubject ? { action: (val: actionType) => actionSubject.next(val) } : {};

  return WrappedComponent => {
    return class Connect extends React.Component<{ state$: Observable<any> }> {
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
