import { IQuery, ITimeBoundary, QueryKind, ITimeDuration } from '@autoschedule/queries-fn';
import * as React from 'react';

import { ICoreState } from '@scheduler-tester/core-state/core.state';

import { connect } from './util/connect';

import { wholeQuery } from './query/util';

interface ICmpProps {
  state: ICoreState;
}

const cmp: React.SFC<ICmpProps> = ({ state }) => (
  <div>
    {`const config: IConfig = { endDate: ${state.config.endDate}, startDate: ${
      state.config.startDate
    } };`}
    <br />
    {'const queries: Q.IQuery[] = ['}
    {state.onTestbenchQueries === -1
      ? ''
      : state.suites[state.onTestbenchQueries].map(queryToPrettyPrint)}
    {'];'}
  </div>
);

const selector = (state: ICoreState) => ({ state });

export default connect(selector)(cmp);

const queryToPrettyPrint = (q: IQuery) => {
  const query = q as wholeQuery;
  return (
    <div>
      Q.queryFactory(
      {Object.keys(query)
        .map(k => {
          const key = k as keyof wholeQuery;
          switch (key) {
            case 'id':
            case 'name': {
              return `Q.${key}(${query[key]}),`;
            }
            case 'end':
            case 'start': {
              const tb = query[key] as ITimeBoundary;
              return `Q.${key}(${tb.target}${tb.min ? ', ' + tb.min : ''}),`;
            }
            case 'kind': {
              const kind = query[key] as QueryKind;
              return kind !== QueryKind.Atomic ? `Q.kind(Q.QueryKind.${QueryKind[kind]}),` : '';
            }
            case 'duration': {
              const dur = query[key] as ITimeDuration;
              return `Q.duration(Q.timeDuration(${dur.target}${
                dur.min === dur.target ? '' : ',' + dur.min
              })),`;
            }
            default: {
              return '--';
            }
          }
        })
        .filter(entry => entry !== '')}
      ),
    </div>
  );
};
