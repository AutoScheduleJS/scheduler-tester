import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';

interface CustomableProps {
  classes?: {
    root: string;
  };
  theme?: any;
}

enum TabsFixedPlacement {
  FullWidth,
  Centered,
  LeftAligned,
  RightAligned
};

interface TabsFixedProps extends CustomableProps {
  placement: TabsFixedPlacement;
  activeIndex: number;
}

interface TabsFixedTheme {
  tabs: {
    elevation: number;
    totalHeight: string;
  };
}

const defaultTheme = (theme: any): TabsFixedTheme => ({
  tabs: {
    totalHeight: '56px',
    elevation: 4,
    ...theme.tabs,
  },
});

const defaultClasses = {
  root: {},
};

const TabsFixedRootStyles = (theme: TabsFixedTheme) => css`
  height: ${theme.tabs.totalHeight};
`;

class TabsFixedImpl extends React.PureComponent<TabsFixedProps> {
  componentWillReceiveProps(nextProp: TabsFixedProps) {
    if (this.props.activeIndex !== nextProp.activeIndex) {
      console.log('activeIndex changed!');
    }
  }
  render() {
    const { children, theme: incomingTheme, classes = defaultClasses } = this.props;
    const theme = defaultTheme(incomingTheme);
    return (
      <div className={css`${TabsFixedRootStyles(theme)} ${classes.root}`}>
        {children}
      </div>
    );
  }
}

export const TabsFixed = withTheme(TabsFixedImpl);
