import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

export const connect = (selector: (s: any) => any = state => state, state$: Observable<any>) => {
  return WrappedComponent => {
    return class Connect extends React.Component<{}> {
      private subscription;
      public componentWillMount() {
        this.subscription = state$.pipe(map(selector)).subscribe(this.setState.bind(this));
      }

      public componentWillUnmount() {
        this.subscription.unsubscribe();
      }

      public render() {
        return <WrappedComponent {...this.state} {...this.props} />;
      }
    };
  };
};
