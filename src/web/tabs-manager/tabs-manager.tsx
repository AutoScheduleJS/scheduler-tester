import { createStyles, Tab, Tabs, Theme, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import * as React from 'react';

export interface ITabManagerFromState {
  activeIndex: number;
}

export interface ITabManagerProps {
  labels: string[];
  onTabChange: (i: number) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    tabRoot: {
      color: theme.palette.text.primary,
    },
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
          {labels.map(label => <Tab {...{ label }} classes={{ root: classes.tabRoot }} />)}
        </Tabs>
        {React.Children.toArray(children).filter((_, i) => i === activeIndex)}
      </div>
    );
  }
}

export const TabsManager = withStyles(styles)(TabsManagerImp);
