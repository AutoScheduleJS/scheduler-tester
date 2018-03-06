import { ITimeDuration } from '@autoschedule/queries-fn';
import * as React from 'react';

import ObjectToForm from '../shared/object-to-form';
import { displayFlex } from '../shared/style.css';

interface ICmpProps {
  timeDuration: ITimeDuration | undefined;
  actionFn: (a: ITimeDuration | undefined) => void;
}

const cmp: React.SFC<ICmpProps> = ({ actionFn, timeDuration, children }) => (
  <div className={displayFlex}>
    <div>{children}</div>
    <ObjectToForm
      value={timeDuration}
      labels={[{ key: 'min', label: 'Min'}, { key: 'target', label: 'Target'}]}
      updateFn={v => actionFn(formToObject(v))}
    />
    <button onClick={() => actionFn({ ...defaultValue })}>default</button>
  </div>
);

export default cmp;

const defaultValue: ITimeDuration = { min: 1, target: 1 };

const formToObject = (form: ITimeDuration): ITimeDuration | undefined => {
  if (!form.target && !form.min) {
    return undefined;
  }
  return form;
};