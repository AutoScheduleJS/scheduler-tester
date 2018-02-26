import * as React from 'react';

import { ICoreState, StepOption } from '../../../core-state/core.state';
import { actionTrigger$ } from '../../../core-state/core.store';

import { connect } from '../util/connect';

interface IState {
  state: ReadonlyArray<any>;
}

interface ICmpProps extends IState {
  action: (u: any) => void;
  newSuiteFn: () => any;
  addLabel: string;
}

const cmp: React.SFC<ICmpProps> = ({ action, addLabel, children, newSuiteFn, state }) => (
  <div>
    {stateToSuite(addLabel, state)}
    <button onClick={() => action(newSuiteFn())}>{children}</button>
  </div>
);

export default (selector: (s: ICoreState) => IState) => connect(selector, actionTrigger$)(cmp);

const stateToSuite = (addLabel: string, state: ReadonlyArray<any>) =>
  state.map(suite => (
    <div>
      <StSuiteItem {...{}}>{addLabel || 'ADD ITEM'}}</StSuiteItem>
    </div>
  ));
