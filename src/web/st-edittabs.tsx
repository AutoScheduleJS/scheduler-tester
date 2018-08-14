import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionTrigger$, coreState$ } from '@scheduler-tester/core-state/core.store';
import { UpdateEditTab } from '@scheduler-tester/core-state/edit-tab.ui.reducer';
import { ThemeProvider } from 'emotion-theming';
import * as React from 'react';
import { TabsFixed, TabsFixedPlacement, TabsFixedProps } from './tabs-fixed/tabs-fixed';
import { connect } from './util/connect';
import { css } from 'emotion';
import { mergeProps } from './util/hoc.util';

const selector = ({ ui }: ICoreState) => ({
  activeTab: ui.editTab,
});

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type TabsWithoutIndex = Omit<TabsFixedProps, 'activeTab'>;

const TabsFixedInner = connect(selector, coreState$)<TabsWithoutIndex, { activeTab: string }>(
  TabsFixed
);

const handleNewTab = (tabId: string) => actionTrigger$.next(new UpdateEditTab(tabId));

interface StEdittabsProps {
  className?: string;
}

const adjustedTheme = ancestorTheme => ({
  ...ancestorTheme,
  tabs: { ...ancestorTheme.tabs, backgroundColor: '' },
});

const tabsFixedInnerStyle = css`
  flex-grow: 2;
`;

export class StEdittabs extends React.PureComponent<StEdittabsProps> {
  render() {
    const tabs = [
      { label: 'Queries manager', id: 'qm' },
      { label: 'User-state manager', id: 'usm' },
    ];
    const tabsFixedProps = mergeProps(this.props, { className: tabsFixedInnerStyle });
    return (
      <ThemeProvider theme={adjustedTheme}>
        <TabsFixedInner
          placement={TabsFixedPlacement.Centered}
          onTabChange={handleNewTab}
          tabs={tabs}
          {...tabsFixedProps}
        />
      </ThemeProvider>
    );
  }
}
