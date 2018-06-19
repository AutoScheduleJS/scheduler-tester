import { IQueryInternal, QueryKind } from '@autoschedule/queries-fn';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import * as React from 'react';

interface IqueryCardProps {
  query: IQueryInternal;
}

const QueryDisplayKind: React.SFC<{ query: IQueryInternal }> = ({ query }) => {
  const kind = query.kind;
  return <span>Query kind: {kind === QueryKind.Atomic ? 'atomic' : 'placeholder'}</span>;
};

export class QueryCard extends React.PureComponent<IqueryCardProps> {
  render() {
    const { query } = this.props;
    return (
      <Card>
        <CardHeader title={query.name} subheader={query.id} />
        <CardContent>
          <QueryDisplayKind {...{ query }} />
        </CardContent>
      </Card>
    );
  }
}
