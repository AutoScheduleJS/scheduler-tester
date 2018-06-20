import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import React from 'react';
import withWidth, { isWidthDown, WithWidthProps } from '@material-ui/core/withWidth';

/**
 * Dialog will responsively be full screen *at or below* the given breakpoint
 * (defaults to 'sm' for mobile devices).
 * Notice that this Higher-order Component is incompatible with server side rendering.
 */
const withMobileDialog = <P extends {}>(options?: { breakpoint: Breakpoint }) => (
  Component: React.ComponentType<any>
): React.ComponentType<P & Partial<WithWidthProps>> => {
  const { breakpoint = 'sm' } = options || {};

  function WithMobileDialog(props: { width: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
    return <Component fullScreen={isWidthDown(breakpoint, props.width)} {...props} />;
  }

  return withWidth()(WithMobileDialog);
};

export default withMobileDialog;
