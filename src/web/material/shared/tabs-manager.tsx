import * as React from 'react';
import { Tabs, Tab } from '@material-ui/core';

interface ITabManagerItemProps {
  labels: string[];
  activeIndex: number;
  onTabChange: (i: number) => void;
}

export class TabsManager extends React.PureComponent<ITabManagerItemProps> {
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
