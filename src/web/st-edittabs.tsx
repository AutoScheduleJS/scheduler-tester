import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionTrigger$, coreState$ } from '@scheduler-tester/core-state/core.store';
import * as React from 'react';
import { UpdateEditTab } from '@scheduler-tester/core-state/edit-tab.ui.reducer';
import { ITabManagerFromState, ITabManagerProps, TabsManager } from './tabs-manager/tabs-manager';
import { connect } from './util/connect';

const selector = ({ ui }: ICoreState): ITabManagerFromState => ({
  activeIndex: ui.editTab,
});

const EditTabsManagerInner = connect(selector, coreState$)<ITabManagerProps, ITabManagerFromState>(
  TabsManager
);

const handleNewTab = tabIndex => actionTrigger$.next(new UpdateEditTab(tabIndex));

interface StEdittabsProps {
  className?: string;
}

export class StEdittabs extends React.PureComponent<StEdittabsProps> {
  render() {
    const labels = ['Queries manager', 'User-state manager'];
    const props = this.props;
    return <EditTabsManagerInner onTabChange={handleNewTab} {...{ labels }} {...props} />;
  }
}
