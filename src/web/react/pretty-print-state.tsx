import {
  IQuery,
  ITaskTransformNeed,
  ITimeBoundary,
  ITimeDuration,
  ITransformation,
  QueryKind,
} from '@autoschedule/queries-fn';
import * as React from 'react';

import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { IUserstateCollection } from '@scheduler-tester/core-state/userstate-collection.interface';

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
    {emptyOrFn(state.suites[state.onTestbenchQueries], s => s.map(queryToPrettyPrint))}
    {'];'}
    <br />
    {`const testStateManager = queryToStatePotentials([${emptyOrFn(
      state.userstates[state.onTestbenchUserstate],
      s => s.map(userstateToPrettyPrint)
    )}])`}
    <br />
    {`return queriesToPipeline$(config)(testStateManager)(queries).pipe(map(result => { t.true(result.length > 0); }));`}
  </div>
);

const selector = (state: ICoreState) => ({ state });

export default connect(selector)(cmp);

const emptyOrFn = <T extends any>(obj: T, fn: (o: T) => any) => (obj ? fn(obj) : '');

const userstateToPrettyPrint = (col: IUserstateCollection) =>
  `{ collectionName: ${col.collectionName}, data: ${JSON.stringify(col.data)} }`;

const queryToPrettyPrint = (q: IQuery) => {
  const query = q as wholeQuery;
  return (
    <div>
      Q.queryFactory(
      {Object.keys(query)
        .map(k => {
          const key = k as keyof wholeQuery;
          switch (key) {
            case 'id': {
              return `Q.${key}(${query[key]}),`;
            }
            case 'name': {
              return `Q.${key}('${query[key]}'),`;
            }
            case 'end':
            case 'start': {
              const tb = query[key] as ITimeBoundary;
              return `Q.${key}(${tb.target}${minFilter(tb)}),`;
            }
            case 'kind': {
              const kind = query[key] as QueryKind;
              return kind !== QueryKind.Atomic ? `Q.kind(Q.QueryKind.${QueryKind[kind]}),` : '';
            }
            case 'duration': {
              const dur = query[key] as ITimeDuration;
              return `Q.duration(Q.timeDuration(${dur.target}${minFilter(dur)})),`;
            }
            case 'transforms': {
              const trans = query[key] as ITransformation;
              return `Q.transforms([${prettyPrintNeeds(trans.needs)}], [${prettyPrintArray(
                trans.updates
              )}], [${prettyPrintArray(trans.inserts)}]),`;
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

const prettyPrintArray = (items: ReadonlyArray<any>): string => {
  return items.map(item => JSON.stringify(item)).toString();
};

const prettyPrintNeeds = (needs: ReadonlyArray<ITaskTransformNeed>): string => {
  return needs
    .map(
      need =>
        `Q.need(${need.wait}, '${need.collectionName}', ${JSON.stringify(need.find)}, ${
          need.quantity
        }, '${need.ref}')`
    )
    .toString();
};

const minFilter = (time: { min?: number; target?: number }): string =>
  time.min == null ? '' : time.min === time.target ? '' : ',' + time.min;
