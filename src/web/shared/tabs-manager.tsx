import { Tab, Tabs } from '@material-ui/core';
import * as React from 'react';

export interface ITabManagerFromState {
  activeIndex: number;
}

export interface ITabManagerProps {
  labels: string[];
  onTabChange: (i: number) => void;
}

export class TabsManager extends React.PureComponent<ITabManagerProps & ITabManagerFromState> {
  render() {
    const { activeIndex, children, labels, onTabChange } = this.props;
    if (!children) {
      return false;
    }
    return (
      <div>
        <Tabs value={activeIndex} onChange={(_, i) => onTabChange(i)} centered>
          {labels.map(label => <Tab {...{ label }} />)}
        </Tabs>
        {React.Children.toArray(children).filter((_, i) => i === activeIndex)}
      </div>
    );
  }
}
