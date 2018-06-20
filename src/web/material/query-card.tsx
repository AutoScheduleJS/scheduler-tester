import { IQueryInternal, QueryKind } from '@autoschedule/queries-fn';
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
import QueryEdit from './query-edit';

const styles = _ => ({
  card: {
    maxWidth: 250,
  },
});

interface IqueryCardProps {
  classes: any;
  query: IQueryInternal;
}

const QueryDisplayKind: React.SFC<{ query: IQueryInternal }> = ({ query }) => {
  const kind = query.kind;
  return (
    <Typography>Query kind: {kind === QueryKind.Atomic ? 'atomic' : 'placeholder'}</Typography>
  );
};

class QueryCard extends React.PureComponent<IqueryCardProps> {
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
        <QueryEdit
          query={query}
          open={this.state.editOpened}
          onClose={this.closeEditDialog.bind(this)}
        />
      </div>
    );
  }
}

export default withStyles(styles)(QueryCard);
