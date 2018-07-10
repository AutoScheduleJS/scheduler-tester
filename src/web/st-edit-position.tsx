import {
  createStyles,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Icon,
  Typography,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';
import { IQueryPosition } from '../../../queries-fn/es';

const styles = _ =>
  createStyles({
    heading: {},
    secondaryHeading: {},
  });

interface IEditPositionProps {
  position: IQueryPosition;
}

class EditPositionCmp extends React.PureComponent<IEditPositionProps & { classes: any }> {
  state = {
    ...this.props.position,
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { classes, position } = this.props;
    return (
      <React.Fragment>
        <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
          <Typography className={classes.heading}>Position</Typography>
          <Typography className={classes.secondaryHeading} />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
            maximus est, id dignissim quam.
          </Typography>
        </ExpansionPanelDetails>
      </React.Fragment>
    );
  }
}

export const StEditPosition = withStyles(styles)(EditPositionCmp);
