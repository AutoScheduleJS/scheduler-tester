import { Tab, Tabs, withStyles, createStyles } from '@material-ui/core';
import * as React from 'react';
import classNames from 'classnames';

export interface ITabManagerFromState {
  activeIndex: number;
}

export interface ITabManagerProps {
  labels: string[];
  onTabChange: (i: number) => void;
}

const styles = _ =>
  createStyles({
    root: {},
  });

class TabsManagerImp extends React.PureComponent<
  ITabManagerProps & ITabManagerFromState & { classes: any; className?: string }
> {
  render() {
    const { activeIndex, classes, className, children, labels, onTabChange } = this.props;
    if (!children) {
      return false;
    }
    return (
      <div className={classNames(classes.root, className)}>
        <Tabs value={activeIndex} onChange={(_, i) => onTabChange(i)} centered>
          {labels.map(label => <Tab {...{ label }} />)}
        </Tabs>
        {React.Children.toArray(children).filter((_, i) => i === activeIndex)}
      </div>
    );
  }
}

export const TabsManager = withStyles(styles)(TabsManagerImp);
