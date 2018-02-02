import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode } from 'vue';

import { StepOption } from '../core-state/core.state';
import { stepOptionActionType, StepoptionUpdateAction } from '../core-state/step-option.reducer';

interface ICmpProps {
  state: StepOption;
  actionTrigger$: Subject<stepOptionActionType>;
}

const cmp: FunctionalComponentOptions<ICmpProps, string[]> = {
  functional: true,
  render(h, a): VNode {
    const getRadioChecked = (type: StepOption) => (type === a.props.state ? { checked: true } : {});
    const handleRadioChange = e =>
      a.props.actionTrigger$.next(new StepoptionUpdateAction(e.target.value));
    return (
      <div>
        <div>Step option:</div>
        <input
          id="rd-every"
          type="radio"
          name="step-option"
          {...getRadioChecked(StepOption.every)}
          onChange={handleRadioChange}
        />
        <label for="rd-every">EVERY</label>
        <input
          id="rd-last"
          type="radio"
          name="step-option"
          {...getRadioChecked(StepOption.last)}
          onChange={handleRadioChange}
        />
        <label for="rd-last">LAST</label>
      </div>
    );
  },
};

export const stStepOption = { name: 'st-step-option', cmp };
