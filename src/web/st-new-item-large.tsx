import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { AddQueryAction } from '@scheduler-tester/core-state/global.ui.reducer';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Button, ButtonEmphaze } from './button/button';

interface CustomableProps {
  theme?: any;
}

interface StNewItemLargeProps extends CustomableProps {}

class StNewItemLargeImpl extends React.PureComponent<StNewItemLargeProps> {
  handleNew = () => {
    actionTrigger$.next(new AddQueryAction());
  };

  render() {
    return (
      <Button emphaze={ButtonEmphaze.Medium} label={'+ new'} onClick={() => this.handleNew()} />
    );
  }
}

export const StNewItemLarge = withTheme(StNewItemLargeImpl);
