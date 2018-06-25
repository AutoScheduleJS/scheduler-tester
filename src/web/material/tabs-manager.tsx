import * as React from 'react';
import { Tabs, Tab } from '@material-ui/core';

interface ITabManagerItemProps {
  labels: string[];
}

export class TabsManager extends React.PureComponent<ITabManagerItemProps> {
  state = {
    activeIndex: 0,
  };
  render() {
    const { children, labels } = this.props;
    if (!children) {
      return false;
    }
    const { activeIndex } = this.state;
    return (
      <div>
        <Tabs value={activeIndex} onChange={this.handleChange.bind(this)} centered>
          {labels.map(label => <Tab {...{ label }} />)}
        </Tabs>
        {React.Children.toArray(children).filter((_, i) => i === activeIndex)}
      </div>
    );
  }

  protected handleChange(_, index) {
    this.setState({ activeIndex: index });
  }
}
