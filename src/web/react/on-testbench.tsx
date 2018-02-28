import * as React from 'react';

import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionTrigger$, actionType } from '@scheduler-tester/core-state/core.store';

import { connect } from './util/connect';

interface IState {
  benchIndex: number;
  benchSuite: ReadonlyArray<ReadonlyArray<any>>;
}

interface ICmpProps extends IState {
  action: (u: actionType) => void;
  actionFn: (e: string) => actionType;
}

const cmp: React.SFC<ICmpProps> = ({ benchIndex, benchSuite, action, actionFn, children }) => (
  <div>
    <div>{children}</div>
    <select onChange={e => action(actionFn(e.target.value))}>
      <option value="empty" />
      {benchSuite.map(suiteToOptionCmp(benchIndex))}
    </select>
  </div>
);

export default (selector: (s: ICoreState) => IState) => connect(selector, actionTrigger$)(cmp);

const suiteToOptionCmp = (benchIndex: number) => (item: ReadonlyArray<any>, i: number) => (
  <option value={i} {...getOptionSelected(benchIndex, i)}>
    SUITE LENGTH: {item.length}
  </option>
);

const getOptionSelected = (state: number, itemIndex: number) =>
  itemIndex === state ? { selected: true } : {};
