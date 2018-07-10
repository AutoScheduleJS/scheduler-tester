import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ExpansionPanel,
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
import { IQuery } from '../../../queries-fn/es';
import { StEditPosition } from './st-edit-position';
import { connect } from './util/connect';
import withMobileDialog from './util/withMobileDialog';

const styles = theme =>
  createStyles({
    expansion: {
      root: {
        heading: {
          fontSize: theme.typography.pxToRem(15),
          flexBasis: '33.33%',
          flexShrink: 0,
        },
        secondaryHeading: {
          fontSize: theme.typography.pxToRem(15),
          color: theme.palette.text.secondary,
        },
      },
    },
  });

interface IQueryEditFromState {
  query: IQuery;
  isNew: boolean;
}

interface IqueryEditProps {}

class QueryEditCmp extends React.PureComponent<
  IqueryEditProps & IQueryEditFromState & { classes: any; fullScreen: boolean }
> {
  state = {
    ...this.props.query,
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
        return actionTrigger$.next(new DeleteQueryAction(this.props.query));
      }
      return actionTrigger$.next(new CloseEditAction());
    }
    actionTrigger$.next(new UpdateQueryAction(this.props.query, this.state));
  };

  render() {
    const { classes, fullScreen, query } = this.props;
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
          <TextField label="name" value={this.state.name} onChange={this.handleChange('name')} />
          <ExpansionPanel classes={classes.expansion}>
            <StEditPosition position={query.position} />
          </ExpansionPanel>
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
