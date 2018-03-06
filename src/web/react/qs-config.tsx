import * as React from 'react';

import { IConfig } from '@scheduler-tester/core-state/config.interface';
import { ConfigUpdateAction } from '@scheduler-tester/core-state/config.reducer';
import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';

import ObjectToForm from './shared/object-to-form';
import { connect } from './util/connect';

interface ICmpProps {
  config: IConfig;
  action: (u: ConfigUpdateAction) => void;
}

const cmp: React.SFC<ICmpProps> = ({ config, action }) => (
  <div>
    <div>Simul range</div>
    <ObjectToForm
      value={config}
      labels={[{ key: 'endDate', label: 'End date' }, { key: 'startDate', label: 'Start Date' }]}
      updateFn={v => action(new ConfigUpdateAction(formToObject(v)))}
    />
  </div>
);

const selector = ({ config }: ICoreState) => ({ config });

export default connect(selector, actionTrigger$)(cmp);

const formToObject = (form: IConfig): IConfig => {
  return {
    endDate: form.endDate != null ? form.endDate : 100,
    startDate: form.startDate != null ? form.startDate : 0,
  };
};
