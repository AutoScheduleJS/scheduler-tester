import { Subject } from 'rxjs/Subject';
import { FunctionalComponentOptions, VNode, VNodeData } from 'vue';

import { StepOption } from '../core-state/core.state';
import { StepoptionUpdateAction, suiteActionType } from '../core-state/step-option.reducer';

const cmp: FunctionalComponentOptions<Record<string, any>, string[]> = {
  functional: true,
  render(h, a): VNode {
    const data: VNodeData & {
      state: StepOption;
      actionTrigger$: Subject<suiteActionType>;
    } = a.data as any;
    const actionTrigger$ = data.actionTrigger$;
    const getRadioChecked = (type: StepOption) => type === data.state ? { checked: true } : { };
    const handleRadioChange = (e) => actionTrigger$.next(new StepoptionUpdateAction(e.target.value));
    return (
      <div>
        <div>Step option:</div>
        <input id="rd-every" type="radio" name="step-option" { ...getRadioChecked(StepOption.every) } onChange={handleRadioChange} />
        <label for="rd-every">EVERY</label>
        <input id="rd-last" type="radio" name="step-option" { ...getRadioChecked(StepOption.last) } onChange={handleRadioChange} />
        <label for="rd-last">LAST</label>
      </div>
    );
  },
};

export const stStepOption = { name: 'st-step-option', cmp };
