import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';

interface CustomableProps {
  classes?: {
    root: string;
  };
  theme?: any;
}

interface AppBarProps extends CustomableProps {}

interface AppBarTheme {
  appBar: {
    totalHeight: string;
  };
}

const defaultTheme = (theme: any): AppBarTheme => ({
  appBar: {
    totalHeight: '56px',
    ...theme.appBar,
  },
});

const defaultClasses = {
  root: {},
};

const AppBarRootStyles = (theme: AppBarTheme) => css`
  height: ${theme.appBar.totalHeight};
`;

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

export const AppBar = withTheme(AppBarImpl);
