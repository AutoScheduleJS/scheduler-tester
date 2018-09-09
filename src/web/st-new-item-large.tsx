import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Ref } from 'react';
import { Button, ButtonEmphaze } from './button/button';

interface CustomableProps extends React.ReactHTMLElement<HTMLDivElement> {
  theme?: any;
}

interface StNewItemLargeProps extends CustomableProps {
  forwardedRef?: Ref<HTMLDivElement>;
}

class StNewItemLargeImpl extends React.PureComponent<StNewItemLargeProps> {
  render() {
    const { key, forwardedRef, theme, ...defaultHostProps } = this.props;
    return (
      <React.Fragment>
        <Button
          emphaze={ButtonEmphaze.Medium}
          label={'+ new'}
          {...defaultHostProps}
          ref={forwardedRef}
        />
      </React.Fragment>
    );
  }
}

const StNewItemLargeWithTheme = withTheme(StNewItemLargeImpl);

export const StNewItemLarge = React.forwardRef<HTMLDivElement, StNewItemLargeProps>(
  (props: any, ref) => <StNewItemLargeWithTheme {...props} forwardedRef={ref} />
);
