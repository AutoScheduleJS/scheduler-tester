import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Elevation } from '../elevation/elevation';
import { nodeWrapper } from '../node-wrapper/node-wrapper';

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
      <Elevation elevation={4}>
        {nodeWrapper({
          className: css`
            ${AppBarRootStyles(theme)} ${classes.root};
          `,
        })(children)}
      </Elevation>
    );
  }
}

export const AppBar = withTheme(AppBarImpl);
