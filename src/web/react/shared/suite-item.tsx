import * as React from 'react';

import { IItemCmpProps } from './item-props.interface';

interface ISuiteItemProps {
  action: (u: any) => void;
  newItemFn: (a: any) => any;
  itemCmp: React.SFC<IItemCmpProps>;
  suite: ReadonlyArray<any>;
  extraProps?: any;
}

const cmp: React.SFC<ISuiteItemProps> = ({ action, extraProps, itemCmp, newItemFn, suite, children }) => (
  <div>
    {suiteToItems(action, extraProps, suite, itemCmp)}
    <button onClick={() => action(newItemFn(suite))}>{children}</button>
  </div>
);

export default cmp;

const suiteToItems = (action, extraProps, suite, ItemCmp: React.SFC<IItemCmpProps>) =>
  suite.map(item => (
    <div>
      <ItemCmp {...{ action, item, suite }} {...extraProps || {}} />
    </div>
  ));
