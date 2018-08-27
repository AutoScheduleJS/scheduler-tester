import { TabId } from '@scheduler-tester/core-state/edit-tab.ui.reducer';
import { EditUI } from '@scheduler-tester/core-state/edit.ui.reducer';

export interface UIState {
  edit: EditUI;
  editTab: TabId;
}
