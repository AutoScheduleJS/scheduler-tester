import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionTrigger$, coreState$ } from '@scheduler-tester/core-state/core.store';
import { UpdateEditTab } from '@scheduler-tester/core-state/edit-tab.ui.reducer';
import * as React from 'react';
import { TabsFixed, TabsFixedPlacement, TabsFixedProps } from './tabs-fixed/tabs-fixed';
import { connect } from './util/connect';

const selector = ({ ui }: ICoreState) => ({
  activeTab: ui.editTab,
});

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type TabsWithoutIndex = Omit<TabsFixedProps, 'activeTab'>;

const EditTabsManagerInner = connect(selector, coreState$)<TabsWithoutIndex, { activeTab: string }>(
  TabsFixed
);

const handleNewTab = (tabIndex: string) => actionTrigger$.next(new UpdateEditTab(tabIndex));

interface StEdittabsProps {
  className?: string;
}

export class StEdittabs extends React.PureComponent<StEdittabsProps> {
  render() {
    const tabs = [{ label: 'Queries manager', id: 'qm' }, { label: 'User-state manager', id: 'usm' }];
    const props = this.props;
    return (
      <EditTabsManagerInner
        placement={TabsFixedPlacement.Centered}
        onChange={handleNewTab}
        {...{ tabs }}
        {...props}
      />
    );
  }
}
