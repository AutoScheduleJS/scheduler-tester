import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Button, ButtonEmphaze } from './button/button';

interface CustomableProps {
  theme?: any;
  action: () => void;
}

interface StNewItemLargeProps extends CustomableProps {}

class StNewItemLargeImpl extends React.PureComponent<StNewItemLargeProps> {
  handleNew = () => {
    const action = this.props.action;
    actionTrigger$.next(new action());
  };

  render() {
    return (
      <Button emphaze={ButtonEmphaze.Medium} label={'+ new'} onClick={() => this.handleNew()} />
    );
  }
}

export const StNewItemLarge = withTheme(StNewItemLargeImpl);
