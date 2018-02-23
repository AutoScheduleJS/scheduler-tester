import * as React from 'react';

import { ICoreState, StepOption } from '../../core-state/core.state';
import { actionTrigger$ } from '../../core-state/core.store';
import { StepOptionUpdateAction } from '../../core-state/step-option.reducer';

import { connect } from './util/connect';

interface ICmpProps {
  stepOption: StepOption;
  action: (u: StepOptionUpdateAction) => void;
}

const cmp: React.SFC<ICmpProps> = ({ stepOption, action }) => (
  <div>
    <div>Step option:</div>
    <input
      id="rd-every"
      type="radio"
      name="step-option"
      checked={getRadioChecked(StepOption.every, stepOption)}
      onChange={handleRadioChange(StepOption.every, action)}
    />
    <label htmlFor="rd-every">EVERY</label>
    <input
      id="rd-last"
      type="radio"
      name="step-option"
      checked={getRadioChecked(StepOption.last, stepOption)}
      onChange={handleRadioChange(StepOption.last, action)}
    />
    <label htmlFor="rd-last">LAST</label>
  </div>
);

const selector = ({ stepOption }: ICoreState) => ({ stepOption });

export default connect(selector, actionTrigger$)(cmp);

const getRadioChecked = (type: StepOption, state: StepOption) => (type === state ? true : false);
const handleRadioChange = (type: StepOption, update: (u: StepOptionUpdateAction) => void) => _ => {
  update(new StepOptionUpdateAction(type));
}
