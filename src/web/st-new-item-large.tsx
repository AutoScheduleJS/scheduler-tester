import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Button, ButtonEmphaze } from './button/button';
import { MorphParameters } from './react-morph/morph';

interface CustomableProps {
  theme?: any;
  action: any;
  morph: MorphParameters;
}

interface StNewItemLargeProps extends CustomableProps {}

class StNewItemLargeImpl extends React.PureComponent<StNewItemLargeProps> {
  handleNew = () => {
    const action = this.props.action;
    actionTrigger$.next(new action());
  };

  render() {
    const { morph } = this.props;
    return (
      <Button
        {...morph.from('card')}
        emphaze={ButtonEmphaze.Medium}
        label={'+ new'}
        onClick={() => this.handleNew()}
      />
    );
  }
}

export const StNewItemLarge = withTheme(StNewItemLargeImpl);
