import { TabId } from '@scheduler-tester/core-state/edit-tab.ui.reducer';
import { EditUI } from '@scheduler-tester/core-state/edit.ui.reducer';
import { ScrimUI } from '@scheduler-tester/core-state/scrim.ui.reducer';

export interface UIState {
  edit: EditUI;
  editTab: TabId;
  scrim: ScrimUI;
}
