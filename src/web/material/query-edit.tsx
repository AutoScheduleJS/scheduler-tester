import { IQueryInternal } from '@autoschedule/queries-fn';
import { Dialog, withStyles, DialogTitle, DialogActions, Button } from '@material-ui/core';
import * as React from 'react';
import withMobileDialog from './util/withMobileDialog';

const styles = _ => ({});

interface IqueryEditProps {
  query: IQueryInternal;
  open: boolean;
  onClose: () => void;
}

class QueryEdit extends React.PureComponent<
  IqueryEditProps & { classes: any; fullScreen: boolean }
> {
  state = {
    editOpened: false,
  };

  closeEditDialog() {
    this.setState({ editOpened: false });
  }

  openEditDialog() {
    this.setState({ editOpened: true });
  }

  render() {
    const { fullScreen, open, onClose } = this.props;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="query-edit-dialog-title"
      >
        <DialogTitle id="query-edit-dialog-title">Edit Query</DialogTitle>
        <DialogActions>
          <Button onClick={onClose}>cancel</Button>
          <Button onClick={onClose} color="primary">
            apply
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withMobileDialog<IqueryEditProps>()(withStyles(styles)(QueryEdit));
