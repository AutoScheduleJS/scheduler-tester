import * as React from 'react';

import { IItemCmpProps } from './item-props.interface';
import SuiteItem from './suite-item';

interface IState {
  state: ReadonlyArray<any>;
}

interface ICmpProps extends IState {
  action: (u: any) => void;
  addLabel: string;
  itemCmp: React.SFC<IItemCmpProps<any>>;
  newSuiteFn: () => any;
  newItemFn: (a: any) => any;
}

const cmp: React.SFC<ICmpProps> = ({
  action,
  addLabel,
  children,
  itemCmp,
  newItemFn,
  newSuiteFn,
  state,
}) => (
  <div>
    {stateToSuite({ action, addLabel, itemCmp, newItemFn, state })}
    <button onClick={() => action(newSuiteFn())}>{children}</button>
  </div>
);

export default cmp;

const stateToSuite = ({ action, addLabel, itemCmp, newItemFn, state }) =>
  state.map(suite => (
    <div>
      <SuiteItem {...{ action, itemCmp, newItemFn, suite }}>{addLabel || 'ADD ITEM'}</SuiteItem>
    </div>
  ));
