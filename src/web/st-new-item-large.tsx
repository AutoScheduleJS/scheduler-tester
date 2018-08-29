import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Button, ButtonEmphaze } from './button/button';
import { MorphParameters } from './react-morph/morph';

interface CustomableProps extends React.ReactHTMLElement<HTMLDivElement> {
  theme?: any;
  morph: MorphParameters;
}

interface StNewItemLargeProps extends CustomableProps {}

class StNewItemLargeImpl extends React.PureComponent<StNewItemLargeProps> {
  render() {
    const { morph, key, ...defaultHostProps } = this.props;
    return (
      <Button
        {...morph.from('container')}
        emphaze={ButtonEmphaze.Medium}
        label={'+ new'}
        {...defaultHostProps}
      />
    );
  }
}

export const StNewItemLarge = withTheme(StNewItemLargeImpl);
