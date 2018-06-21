import {
  IQuery,
  IQueryLink,
  IQueryLinkInternal,
  IQueryPositionInternal,
  IQueryTransformationInternal,
  ITaskTransformNeed,
  QueryKind,
} from '@autoschedule/queries-fn';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { IUserstateCollection } from '@scheduler-tester/core-state/userstate-collection.interface';
import * as React from 'react';
import { connect } from './util/connect';

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
  const query = q as IQuery;
  return (
    <div>
      Q.queryFactory(
      {Object.keys(query)
        .map(k => {
          const key = k as keyof IQuery;
          switch (key) {
            case 'id': {
              return `Q.${key}(${query[key]}),`;
            }
            case 'name': {
              return `Q.${key}('${query[key]}'),`;
            }
            case 'position': {
              return `Q.position(${prettyPos(query.position)})`;
            }
            case 'kind': {
              const kind = query[key];
              return kind !== QueryKind.Atomic ? `Q.kind(Q.QueryKind.${QueryKind[kind]}),` : '';
            }
            case 'splittable': {
              const split = query[key];
              if (!split) {
                return '';
              }
              return `Q.splittable(${split})`;
            }
            case 'transforms': {
              const trans = query[key] as IQueryTransformationInternal;
              return `Q.transforms([${prettyPrintNeeds(trans.needs)}], [${prettyPrintArray(
                trans.updates
              )}], [${prettyPrintArray(trans.inserts)}]),`;
            }
            case 'links': {
              const links = query[key] as IQueryLinkInternal[];
              return `Q.links(${prettyPrintLinks(links)}),`;
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

const prettyPos = (item: IQueryPositionInternal): string => {
  return `${prettyObj(item)}`;
};

const prettyObj = (obj: any): string => {
  if (typeof obj !== 'object') {
    return obj;
  }
  return `{${Object.entries(obj).reduce((acc: string, [key, val]) => {
    if (val == null) {
      return acc;
    }
    return `${acc}, ${key}: ${prettyObj(val)}`;
  }, '').substr(2)}}`;
};

const prettyPrintArray = (items: ReadonlyArray<any>): string => {
  return items.map(item => JSON.stringify(item)).toString();
};

const prettyPrintLinks = (links: ReadonlyArray<IQueryLink>): string => {
  return links
    .map(
      link =>
        `Q.queryLink(${JSON.stringify(link.distance)}, '${link.origin}', ${link.queryId}, ${
          link.potentialId
        }${link.splitId ? ' ' + link.splitId : ''})`
    )
    .toString();
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
