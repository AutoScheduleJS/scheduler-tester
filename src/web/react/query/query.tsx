import { IQueryInternal, ITimeDurationInternal } from '@autoschedule/queries-fn';
import { Button } from '@material-ui/core';
import { SuitesQueryDeleteAction, SuitesQueryUpdateAction } from '@scheduler-tester/core-state/suites.reducer';
import * as React from 'react';
import { IItemCmpProps } from '../shared/item-props.interface';
import { width } from '../shared/style.css';
import SuiteItem from '../shared/suite-item';
import QueryLink, { pushLink } from './query-link';
import TimeBoundary from './time-boundary';
import TimeDuration from './time-duration';
import TransformInsert, { defaultInsert } from './transform-insert';
import TransformNeed, { defaultNeed } from './transform-need';
import TransformUpdate, { defaultUpdate } from './transform-update';
import { pushTransform } from './util';

const cmp: React.SFC<IItemCmpProps<IQueryInternal>> = ({ action, item, suite }) => {
  const updateFn = updateAction({ action, item, suite });
  return (
    <div>
      <textarea
        className={width('100%')}
        rows={5}
        defaultValue={JSON.stringify(item)}
        key={JSON.stringify(item)}
        onBlur={e => updateFn(JSON.parse(e.currentTarget.value))}
      />
      <Button onClick={() => action(new SuitesQueryDeleteAction(suite, item))}>DELETE</Button>
      <TimeBoundary
        {...{
          actionFn: t => updateFn({ ...item, position: { ...item.position, start: t } }),
          timeBoundary: item.position.start,
        }}
      >
        start
      </TimeBoundary>
      <TimeBoundary
        {...{
          actionFn: t => updateFn({ ...item, position: { ...item.position, end: t } }),
          timeBoundary: item.position.end,
        }}
      >
        end
      </TimeBoundary>
      <TimeDuration
        {...{
          actionFn: t =>
            updateFn({
              ...item,
              position: { ...item.position, duration: t as ITimeDurationInternal },
            }),
          timeDuration: item.position.duration,
        }}
      >
        duration
      </TimeDuration>
      <SuiteItem
        {...{
          action,
          extraProps: { query: item, qSuite: suite },
          itemCmp: TransformNeed,
          newItemFn: _ => updateFn(pushTransform(item, 'needs', { ...defaultNeed })),
          suite: item.transforms ? item.transforms.needs : [],
        }}
      >
        add need
      </SuiteItem>
      <SuiteItem
        {...{
          action,
          extraProps: { query: item, qSuite: suite },
          itemCmp: TransformInsert,
          newItemFn: _ => updateFn(pushTransform(item, 'inserts', { ...defaultInsert })),
          suite: item.transforms ? item.transforms.inserts : [],
        }}
      >
        add insert
      </SuiteItem>
      <SuiteItem
        {...{
          action,
          extraProps: { query: item, qSuite: suite },
          itemCmp: TransformUpdate,
          newItemFn: _ => updateFn(pushTransform(item, 'updates', { ...defaultUpdate })),
          suite: item.transforms ? item.transforms.updates : [],
        }}
      >
        add update
      </SuiteItem>
      <SuiteItem
        {...{
          action,
          extraProps: { query: item, qSuite: suite },
          itemCmp: QueryLink,
          newItemFn: _ => updateFn(pushLink(item)),
          suite: item.links ? item.links : [],
        }}
      >
        add link
      </SuiteItem>
    </div>
  );
};

export default cmp;

const updateAction = ({ action, item, suite }: IItemCmpProps<IQueryInternal>) => (
  newQuery: IQueryInternal
) => action(new SuitesQueryUpdateAction(suite, item, newQuery));
