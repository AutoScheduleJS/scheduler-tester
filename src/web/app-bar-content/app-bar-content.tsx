import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';

interface CustomableProps {
  classes?: {
    root: string;
  };
  theme?: any;
}

interface AppBarContentProps extends CustomableProps {
  title?: string;
}

interface AppBarContentTheme {
  appBar: {
    totalHeight: string;
  };
}

const defaultTheme = (theme: any): AppBarContentTheme => ({
  appBar: {
    totalHeight: '56px',
    ...theme.appBar,
  },
});

const defaultClasses = {
  root: {},
};

const AppBarContentRootStyles = (theme: AppBarContentTheme) => css`
  height: ${theme.appBar.totalHeight};
`;

class AppBarContentImpl extends React.PureComponent<AppBarContentProps> {
  render() {
    const { theme: incomingTheme, classes = defaultClasses, title = '' } = this.props;
    const theme = defaultTheme(incomingTheme);
    return (
      <div
        className={css`
          ${AppBarContentRootStyles(theme)} ${classes.root};
        `}
      >
        {title}
      </div>
    );
  }
}

/**
 * Follow https://material.io/design/components/app-bars-top.html#specs guide
 *
 * navigation icon (optional)
 *
 * title (optional)
 *
 * action button <- specify if it can / have to / can't overflow
 *
 * all default specs are in theme and can be customised by user
 *
 */
export const AppBarContent = withTheme(AppBarContentImpl);
