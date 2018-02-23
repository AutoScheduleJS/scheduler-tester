import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { coreState$ } from '../../core-state/core.store';

import StepOption from './step-option';

const app =
<div>
  <div>
    <StepOption {...{state$: coreState$}} />
  </div>
</div>;
ReactDOM.render(app, document.getElementById('app'));
