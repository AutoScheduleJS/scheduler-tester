import { ITimeBoundary } from '@autoschedule/queries-fn';
import * as React from 'react';

import ObjectToForm from '../shared/object-to-form';
import { displayFlex } from '../shared/style.css';

interface ICmpProps {
  timeBoundary: ITimeBoundary | undefined;
  actionFn: (a: ITimeBoundary | undefined) => void;
}

const cmp: React.SFC<ICmpProps> = ({ actionFn, timeBoundary, children }) => (
  <div className={displayFlex}>
    <div>{children}</div>
    <ObjectToForm
      value={timeBoundary}
      labels={[{ key: 'target', label: 'Target' }]}
      updateFn={v => actionFn(formToObject(v))}
    />
    <button onClick={() => actionFn({ ...defaultValue })}>default</button>
  </div>
);

export default cmp;

const defaultValue: ITimeBoundary = { min: 1, target: 1, max: 1 };

const formToObject = (form: ITimeBoundary): ITimeBoundary | undefined => {
  if (!form.target) {
    return undefined;
  }
  return form;
};
