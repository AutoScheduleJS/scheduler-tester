import { IQuery, QueryKind } from '@autoschedule/queries-fn';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Icon,
  IconButton,
  Typography,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';
import { uiActionTrigger$ } from './ui-state/ui.store';
import { EditQueryAction } from './ui-state/edit.ui.reducer';

const styles = _ => ({
  card: {
    maxWidth: 250,
  },
});

interface IqueryCardProps {
  classes: any;
  query: IQuery;
}

const QueryDisplayKind: React.SFC<{ query: IQuery }> = ({ query }) => {
  const kind = query.kind;
  return (
    <Typography>Query kind: {kind === QueryKind.Atomic ? 'atomic' : 'placeholder'}</Typography>
  );
};

class QueryCard extends React.PureComponent<IqueryCardProps> {
  openEditDialog() {
    uiActionTrigger$.next(new EditQueryAction(this.props.query));
  }

  render() {
    const { classes, query } = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardHeader title={query.name} subheader={`#${query.id}`} />
          <CardContent>
            <QueryDisplayKind {...{ query }} />
          </CardContent>
          <CardActions>
            <IconButton onClick={this.openEditDialog.bind(this)} aria-label="edit">
              <Icon>edit</Icon>
            </IconButton>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(QueryCard);
