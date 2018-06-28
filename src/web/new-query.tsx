import { Button, Icon } from '@material-ui/core';
import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { AddQuery } from '@scheduler-tester/core-state/global.ui.reducer';
import * as React from 'react';

interface INewQueryButtonProps {}

export class NewQueryButton extends React.PureComponent<INewQueryButtonProps> {
  handleNew = () => {
    actionTrigger$.next(new AddQuery());
  };

  render() {
    return (
      <Button variant="fab" onClick={() => this.handleNew()}>
        <Icon>add</Icon>
      </Button>
    );
  }
}
