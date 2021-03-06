import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionTrigger$, coreState$ } from '@scheduler-tester/core-state/core.store';
import { TabId, UpdateEditTab } from '@scheduler-tester/core-state/edit-tab.ui.reducer';
import { ThemeProvider } from 'emotion-theming';
import * as React from 'react';
import { TabsFixed, TabsFixedPlacement, TabsFixedProps } from './tabs-fixed/tabs-fixed';
import { connect } from './util/connect';

const selector = ({ ui }: ICoreState) => ({
  activeTab: `${ui.editTab}`,
});

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type TabsWithoutIndex = Omit<TabsFixedProps, 'activeTab'>;

const TabsFixedInner = connect(selector, coreState$)<TabsWithoutIndex, { activeTab: string }>(
  TabsFixed
);

const handleNewTab = (tabId: string) => actionTrigger$.next(new UpdateEditTab(+tabId));

interface StEdittabsProps {
  className?: string;
}

const adjustedTheme = ancestorTheme => ({
  ...ancestorTheme,
  tabs: { ...ancestorTheme.tabs, backgroundColor: '' },
});

export class StEdittabs extends React.PureComponent<StEdittabsProps> {
  render() {
    const tabs = [
      { label: 'Queries manager', id: `${TabId.Queries}` },
      {
        label: 'User-state manager',
        id: `${TabId.Userstates}`,
      },
    ];
    return (
      <ThemeProvider theme={adjustedTheme}>
        <TabsFixedInner
          placement={TabsFixedPlacement.Centered}
          onTabChange={handleNewTab}
          tabs={tabs}
          {...this.props}
        />
      </ThemeProvider>
    );
  }
}
