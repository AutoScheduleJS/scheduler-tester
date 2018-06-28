import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { actionTrigger$, coreState$ } from '@scheduler-tester/core-state/core.store';
import * as React from 'react';
import { UpdateEditTab } from '../core-state/edit-tab.ui.reducer';
import { ITabManagerFromState, ITabManagerProps, TabsManager } from './shared/tabs-manager';
import { connect } from './util/connect';

const selector = ({ ui }: ICoreState): ITabManagerFromState => ({
  activeIndex: ui.editTab,
});

const EditTabsManagerInner = connect(selector, coreState$)<ITabManagerProps, ITabManagerFromState>(
  TabsManager
);

const handleNewTab = tabIndex => actionTrigger$.next(new UpdateEditTab(tabIndex));

export const EditTabsManager: React.StatelessComponent<{ labels: string[] }> = (props: {
  labels: string[];
}) => <EditTabsManagerInner onTabChange={handleNewTab} {...props} />;
