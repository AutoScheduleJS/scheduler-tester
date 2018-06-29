import { Button, Icon, withStyles } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { AddQuery } from '@scheduler-tester/core-state/global.ui.reducer';
import * as React from 'react';

const styles = theme => ({
  btn: {
    position: 'absolute',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4,
  } as CSSProperties,
});

interface INewQueryButtonProps {}

class NewQueryButtonImpl extends React.PureComponent<INewQueryButtonProps & { classes: any }> {
  handleNew = () => {
    actionTrigger$.next(new AddQuery());
  };

  render() {
    const { classes } = this.props;
    return (
      <Button className={classes.btn} variant="fab" onClick={() => this.handleNew()}>
        <Icon>add</Icon>
      </Button>
    );
  }
}

export const NewQueryButton = withStyles(styles)(NewQueryButtonImpl);
