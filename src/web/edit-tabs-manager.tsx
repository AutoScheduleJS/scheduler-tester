import { ITabManagerFromState, ITabManagerProps, TabsManager } from './shared/tabs-manager';
import { UIState } from './ui-state/ui.state';
import { uiState$, uiActionTrigger$ } from './ui-state/ui.store';
import { connect } from './util/connect';
import * as React from 'react';
import { UpdateEditTab } from './ui-state/edit-tab.ui.reducer';

const selector = ({ editTab }: UIState): ITabManagerFromState => ({
  activeIndex: editTab,
});

const EditTabsManagerInner = connect(selector, uiState$)<ITabManagerProps, ITabManagerFromState>(
  TabsManager
);

const handleNewTab = tabIndex => uiActionTrigger$.next(new UpdateEditTab(tabIndex));

export const EditTabsManager: React.StatelessComponent<{ labels: string[]}> = (props: { labels: string[] }) => (
  <EditTabsManagerInner onTabChange={handleNewTab} {...props} />
);
