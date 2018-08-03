import * as React from 'react';
import { Button, ButtonClasses, ButtonProps } from './button/button';
import { EffectRipple } from './effect-ripple/effect-ripple';

export interface StButtonProps extends ButtonProps {
  classes?: {
    root?: string;
    innerBtn?: ButtonClasses;
  }
}

export class StButton extends React.PureComponent<StButtonProps> {
  render() {
    const { classes = {}, ...btnProps } = this.props;
    const props = { ...btnProps, classes: classes.innerBtn };
    return (
      <EffectRipple classes={{ root: classes.root }}>
        <Button {...props} />
      </EffectRipple>
    );
  }
}
