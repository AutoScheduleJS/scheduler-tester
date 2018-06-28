import { IQuery } from '@autoschedule/queries-fn';
import {
  Dialog,
  withStyles,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  TextField,
} from '@material-ui/core';
import * as React from 'react';
import withMobileDialog from './util/withMobileDialog';
import { connect } from './util/connect';
import { uiState$, uiActionTrigger$ } from './ui-state/ui.store';
import { UIState } from './ui-state/ui.state';
import { CloseEditAction } from './ui-state/edit.ui.reducer';

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
    uiActionTrigger$.next(new CloseEditAction());
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

const selector = ({ edit }: UIState): IQueryEditFromState => ({
  query: edit.query,
});

export const QueryEdit = withMobileDialog<{}>()(
  connect(selector, uiState$)(withStyles(styles)(QueryEditCmp))
);
