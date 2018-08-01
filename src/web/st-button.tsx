import * as React from 'react';
import { Button, ButtonClasses, ButtonProps } from './button/button';
import { EffectRipple } from './effect-ripple/effect-ripple';

export class StButton extends React.PureComponent<
  ButtonProps & { classes?: { root?: string; button?: ButtonClasses } }
> {
  render() {
    const { classes = {}, ...btnProps } = this.props;
    const props = { ...btnProps, classes: classes.button };
    return (
      <EffectRipple classes={{ root: classes.root }}>
        <Button {...props} />
      </EffectRipple>
    );
  }
}
