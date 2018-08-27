import * as React from 'react';

export const nodeWrapper = (props: any) => (...nodes: Array<React.ReactNode>) => (
  <div {...props}>{nodes}</div>
);

export class DivComponent extends React.PureComponent<any> {
         render() {
           const { children, ...props } = this.props;
           return <div {...props}>{children}</div>;
         }
       }
