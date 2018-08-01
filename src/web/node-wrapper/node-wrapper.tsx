import * as React from 'react';

export const nodeWrapper = (props: any) => (...nodes: Array<React.ReactNode>) => (
  <div {...props}>{nodes}</div>
);
