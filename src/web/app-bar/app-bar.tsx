import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Elevation, withElevation } from '../elevation/elevation';

interface CustomableProps {
  classes?: {
    root: string;
  };
  theme?: any;
}

interface AppBarProps extends CustomableProps {}

interface AppBarTheme {
  appBar: {
    elevation: number;
    totalHeight: string;
  };
}

const defaultTheme = (theme: any): AppBarTheme => ({
  appBar: {
    totalHeight: '56px',
    elevation: 4,
    ...theme.appBar,
  },
});

const defaultClasses = {
  root: {},
};

const AppBarRootStyles = (theme: AppBarTheme) => css`
  height: ${theme.appBar.totalHeight};
`;

/**
 * AppBar container. Not responsible for hiding/reveal upon scroll (should be another component -> when tabs & app-bar are unified, this behavior should be)
 */
class AppBarImpl extends React.PureComponent<AppBarProps> {
  render() {
    const { children, theme: incomingTheme, classes = defaultClasses } = this.props;
    const theme = defaultTheme(incomingTheme);
    return (
      <div
        className={css`
          ${AppBarRootStyles(theme)} ${classes.root};
        `}
      >
        {children}
      </div>
    );
  }
}

export const AppBar = withTheme(withElevation({ elevation: 2 })(AppBarImpl));
