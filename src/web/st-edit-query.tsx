import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  withStyles,
} from '@material-ui/core';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionTrigger$, coreState$ } from '@scheduler-tester/core-state/core.store';
import { CloseEditAction } from '@scheduler-tester/core-state/edit.ui.reducer';
import {
  DeleteQueryAction,
  UpdateQueryAction,
} from '@scheduler-tester/core-state/global.ui.reducer';
import * as React from 'react';
import { IQuery } from '@autoschedule/queries-fn';
import { StEditPosition } from './st-edit-position';
import { connect } from './util/connect';
import withMobileDialog from './util/withMobileDialog';

const styles = _ =>
  createStyles({
    root: {},
  });

interface IQueryEditFromState {
  query: IQuery;
  isNew: boolean;
}

interface IqueryEditProps {}

/**
 * When done, should morph into the card.
 * How to do that? Elements only morph when mounting, getting position info from unmounting element
 * -> content is discarded immediately, how to position element absolutely? impossible.
 */
class QueryEditCmp extends React.PureComponent<
  IqueryEditProps & IQueryEditFromState & { classes: any; fullScreen: boolean }
> {
  state = {
    ...this.props.query,
    position: {
      ...this.props.query.position,
      uiId: Date.now(),
    },
  };

  static getDerivedStateFromProps(props, state) {
    if (state.id === props.query.id || !props.query) {
      return null;
    }
    return {
      ...props.query,
      position: {
        ...props.query.position,
        uiId: Date.now(),
      },
    };
  }

  handleChange = name => newVal => {
    this.setState({
      [name]: newVal,
    });
  };

  handleChangeId = name => newVal => {
    this.setState({
      [name]: {
        ...newVal,
        uiId: Date.now(),
      },
    });
  };

  handleClose = (save: boolean) => {
    if (!save) {
      if (this.props.isNew) {
        return actionTrigger$.next(new DeleteQueryAction(this.props.query));
      }
      return actionTrigger$.next(new CloseEditAction());
    }
    actionTrigger$.next(new UpdateQueryAction(this.props.query, this.state));
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
        <DialogTitle id="query-edit-dialog-title">
          Edit {query.name}#{query.id}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="name"
            value={this.state.name}
            onChange={e => this.handleChange('name')(e.target.value)}
          />
          <StEditPosition
            position={this.state.position}
            onChanged={this.handleChangeId('position')}
          />
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
  query: ui.edit.query as IQuery,
  isNew: ui.edit.isNew,
});

export const StEditQuery = withMobileDialog<{}>()(
  connect(selector, coreState$)(withStyles(styles)(QueryEditCmp))
);
