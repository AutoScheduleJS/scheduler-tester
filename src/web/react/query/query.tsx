import * as React from 'react';

import {
  SuitesQueryDeleteAction,
  SuitesQueryUpdateAction,
} from '@scheduler-tester/core-state/suites.reducer';

import { IItemCmpProps } from '../shared/item-props.interface';

import { pushTransform, wholeQuery } from './util';

import TimeBoundary from './time-boundary';
import TimeDuration from './time-duration';
import TransformInsert, { defaultInsert } from './transform-insert';
import TransformNeed, { defaultNeed } from './transform-need';
import TransformUpdate, { defaultUpdate } from './transform-update';

import SuiteItem from '../shared/suite-item';

const cmp: React.SFC<IItemCmpProps<wholeQuery>> = ({ action, item, suite }) => {
  const updateFn = updateAction({ action, item, suite });
  return (
    <div>
      <textarea
        rows={5}
        defaultValue={JSON.stringify(item)}
        key={JSON.stringify(item)}
        onBlur={e => updateFn(JSON.parse(e.currentTarget.value))}
      />
      <button onClick={() => action(new SuitesQueryDeleteAction(suite, item))}>DELETE</button>
      <TimeBoundary
        {...{
          actionFn: t => updateFn({ ...item, start: t }),
          timeBoundary: item.start,
        }}
      >
        start
      </TimeBoundary>
      <TimeBoundary
        {...{
          actionFn: t => updateFn({ ...item, end: t }),
          timeBoundary: item.end,
        }}
      >
        end
      </TimeBoundary>
      <TimeDuration
        {...{
          actionFn: t => updateFn({ ...item, duration: t }),
          timeDuration: item.duration,
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
        add updates
      </SuiteItem>
    </div>
  );
};

export default cmp;

const updateAction = ({ action, item, suite }: IItemCmpProps<wholeQuery>) => (
  newQuery: wholeQuery
) => action(new SuitesQueryUpdateAction(suite, item, newQuery));
