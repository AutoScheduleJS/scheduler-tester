import { IQuery } from '../../../queries-fn/es';
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
import { CloseEditAction } from '@scheduler-tester/core-state/edit.ui.reducer';
import { connect } from './util/connect';
import withMobileDialog from './util/withMobileDialog';
import { UpdateQueryAction, DeleteQueryAction } from '@scheduler-tester/core-state/global.ui.reducer';

const styles = _ => ({});

interface IQueryEditFromState {
  query: IQuery | false;
  isNew: boolean;
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

  handleClose = (save: boolean) => {
    if (!save) {
      if (this.props.isNew) {
        return actionTrigger$.next(new DeleteQueryAction(this.props.query as IQuery));
      }
      return actionTrigger$.next(new CloseEditAction());
    }
    actionTrigger$.next(new UpdateQueryAction(this.props.query as IQuery, this.state));
  };

  render() {
    const { fullScreen, query } = this.props;
    const saveLabel = this.props.isNew ? 'create' : 'update';
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
          <Button onClick={() => this.handleClose(true)} color="secondary">
            {saveLabel}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const selector = ({ ui }: ICoreState): IQueryEditFromState => ({
  query: ui.edit.query,
  isNew: ui.edit.isNew,
});

export const StQueryEdit = withMobileDialog<{}>()(
  connect(selector, coreState$)(withStyles(styles)(QueryEditCmp))
);
