import * as React from 'react';

import { padding } from '../shared/style.css';

interface ICmpProps {
  value: any;
  labels: ReadonlyArray<{ key: string; label: string }>;
  updateFn: (v: any) => void;
}

const cmp: React.SFC<ICmpProps> = ({ value, labels, updateFn }) => (
  <div>
    {!value ? (
      <span className={padding('0', '10px')}>undefined</span>
    ) : (
      Object.keys(value)
        .filter(findLabel(labels))
        .map(k => {
          const val = value[k];
          if (typeof val === 'number') {
            return (
              <input
                type="number"
                defaultValue={'' + val}
                key={k+val}
                placeholder={findLabel(labels)(k)}
                onBlur={e => updateFn({ ...value, [k]: +e.currentTarget.value })}
              />
            );
          }
          if (typeof val === 'string') {
            return (
              <textarea
                rows={3}
                defaultValue={'' + val}
                key={k+val}
                placeholder={findLabel(labels)(k)}
                onBlur={e => updateFn({ ...value, [k]: e.currentTarget.value })}
              />
            );
          }
        })
    )}
  </div>
);
export default cmp;

const findLabel = (labels: ReadonlyArray<{ key: string; label: string }>) => (key: string) => {
  const label = labels.find(labelObj => labelObj.key === key);
  return label ? label.label : undefined;
};
