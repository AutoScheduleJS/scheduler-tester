import {
  createStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Icon,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';
import { IQueryPosition, ITimeBoundary } from '@autoschedule/queries-fn';
import { StPositionViewer } from './st-position-viewer';

const styles = theme =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  });

interface IEditPositionProps {
  position: IQueryPosition & { uiId: number };
  onChanged: (pos: IQueryPosition) => void;
}

const timeBoundaryDefault = {
  min: undefined,
  target: undefined,
  max: undefined,
};

const positionToSafer = (pos: IQueryPosition) => ({
  start: { ...timeBoundaryDefault },
  end: { ...timeBoundaryDefault },
  duration: { min: undefined, target: undefined },
  ...pos,
});

const computeErrors = (pos: {
  start: ITimeBoundary;
  end: ITimeBoundary;
  duration: { min?: number; target?: number };
}) => {
  return {
    start: {
      min: !pos.start.min ? false : Number.isNaN(pos.start.min),
      target: !pos.start.target ? false : Number.isNaN(pos.start.target),
      max: !pos.start.max
        ? pos.duration.target == null && pos.end.min == null && pos.end.target == null
        : Number.isNaN(pos.start.max),
    },
    end: {
      min: !pos.end.min
        ? pos.duration.target == null && pos.start.max == null && pos.start.target == null
        : Number.isNaN(pos.end.min),
      target: !pos.end.target ? false : Number.isNaN(pos.end.target),
      max: !pos.end.max ? false : Number.isNaN(pos.end.max),
    },
    duration: {
      min: !pos.duration.min
        ? false
        : Number.isNaN(pos.duration.min)
          ? true
          : pos.duration.target != null && pos.duration.min > pos.duration.target,
      target: !pos.duration.target
        ? (!pos.start.max && !pos.start.target) || (!pos.end.min && !pos.end.target)
        : Number.isNaN(pos.duration.target),
    },
  };
};

const hasErrors = (err: {
  start: { min: boolean; max: boolean; target: boolean };
  end: { min: boolean; max: boolean; target: boolean };
  duration: { min: boolean; target: boolean };
}) => {
  return (
    err.start.min ||
    err.start.max ||
    err.start.target ||
    err.end.min ||
    err.end.max ||
    err.end.target ||
    err.duration.min ||
    err.duration.target
  );
};

class EditPositionCmp extends React.PureComponent<IEditPositionProps & { classes: any }> {
  state = {
    position: positionToSafer(this.props.position),
    errors: {
      start: { min: false, max: false, target: false },
      end: { min: false, max: false, target: false },
      duration: { min: false, target: false },
    },
  };

  static getDerivedStateFromProps(props, state) {
    if (state.position.uiId === props.position.uiId) {
      return null;
    }
    return {
      position: positionToSafer(props.position),
      errors: {
        start: { min: false, max: false, target: false },
        end: { min: false, max: false, target: false },
        duration: { min: false, target: false },
      },
    };
  }

  handleChange = (type: string, prop: string) => event => {
    const position = {
      ...this.state.position,
      [type]: {
        ...this.state.position[type],
        [prop]: event.target.value === '' ? undefined : +event.target.value,
      },
    };
    const errors = computeErrors(position);
    if (hasErrors(errors)) {
      return this.setState({
        position,
        errors,
      });
    }
    this.props.onChanged(position);
  };

  render() {
    const { classes, position } = this.props;
    const { start, end, duration } = this.state.position;
    const errors = this.state.errors;
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
          <Typography className={classes.heading}>Position</Typography>
          <StPositionViewer {...positionToSafer(position)} className={classes.secondaryHeading} />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Typography>Start</Typography>
            <TextField
              label="min"
              value={start.min}
              onChange={this.handleChange('start', 'min')}
              error={errors.start.min}
            />
            <TextField
              label="target"
              value={start.target}
              error={errors.start.target}
              onChange={this.handleChange('start', 'target')}
            />
            <TextField
              label="max"
              value={start.max}
              onChange={this.handleChange('start', 'max')}
              error={errors.start.max}
            />
          </div>
          <div>
            <Typography>End</Typography>
            <TextField
              label="min"
              value={end.min}
              onChange={this.handleChange('end', 'min')}
              error={errors.end.min}
            />
            <TextField
              label="target"
              value={end.target}
              error={errors.end.target}
              onChange={this.handleChange('end', 'target')}
            />
            <TextField
              label="max"
              value={end.max}
              onChange={this.handleChange('end', 'max')}
              error={errors.end.max}
            />
          </div>
          <div>
            <Typography>Duration</Typography>
            <TextField
              label="min"
              value={duration.min}
              error={errors.duration.min}
              onChange={this.handleChange('duration', 'min')}
            />
            <TextField
              label="target"
              value={duration.target}
              error={errors.duration.target}
              onChange={this.handleChange('duration', 'target')}
            />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export const StEditPosition = withStyles(styles)(EditPositionCmp);
