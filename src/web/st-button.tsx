import * as React from 'react';
import { Button, ButtonProps } from './button/button';
import { EffectRippleProps } from './effect-ripple/effect-ripple';
import { mergeProps } from './util/hoc.util';
import { withTheme } from 'emotion-theming';

export interface StButtonProps extends ButtonProps {}

class StButtonImp extends React.PureComponent<StButtonProps> {
  render() {
    const props = mergeProps(this.props, EffectRippleProps(this.props.theme));
    return <Button {...props} />;
  }
}

export const StButton = withTheme(StButtonImp);