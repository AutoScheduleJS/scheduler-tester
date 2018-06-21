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

const styles = _ => ({});

interface IqueryEditProps {
  query: IQuery;
  open: boolean;
  onClose: () => void;
}

class QueryEdit extends React.PureComponent<
  IqueryEditProps & { classes: any; fullScreen: boolean }
> {
  state = {
    ...this.props.query,
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

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
        <DialogContent>
          <TextField label="name" value={this.state.name} onChange={this.handleChange('name')} />
        </DialogContent>
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
