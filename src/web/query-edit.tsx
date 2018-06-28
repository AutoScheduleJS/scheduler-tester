import { IQuery } from '@autoschedule/queries-fn';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  withStyles,
} from '@material-ui/core';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionTrigger$, coreState$ } from '@scheduler-tester/core-state/core.store';
import * as React from 'react';
import { CloseEditAction } from '../core-state/edit.ui.reducer';
import { connect } from './util/connect';
import withMobileDialog from './util/withMobileDialog';

const styles = _ => ({});

interface IQueryEditFromState {
  query: IQuery | false;
}

interface IqueryEditProps {}

class QueryEditCmp extends React.PureComponent<
  IqueryEditProps & IQueryEditFromState & { classes: any; fullScreen: boolean }
> {
  state = {
    ...(this.props.query as IQuery),
  };

  static getDerivedStateFromProps(props, state) {
    if (state.id === props.query.id) {
      return null;
    }
    return {
      ...props.query,
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClose = (_: boolean) => {
    actionTrigger$.next(new CloseEditAction());
  };

  render() {
    const { fullScreen, query } = this.props;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={!!query}
        onClose={() => this.handleClose(false)}
        aria-labelledby="query-edit-dialog-title"
      >
        <DialogTitle id="query-edit-dialog-title">Edit Query</DialogTitle>
        <DialogContent>
          <TextField label="name" value={this.state.name} onChange={this.handleChange('name')} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose(false)}>cancel</Button>
          <Button onClick={() => this.handleClose(true)} color="primary">
            save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const selector = ({ ui }: ICoreState): IQueryEditFromState => ({
  query: ui.edit.query,
});

export const QueryEdit = withMobileDialog<{}>()(
  connect(selector, coreState$)(withStyles(styles)(QueryEditCmp))
);
