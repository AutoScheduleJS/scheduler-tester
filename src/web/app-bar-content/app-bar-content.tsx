import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Typography } from '../typography/typography';
import { merge } from '../util/hoc.util';

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
    backgroundColor: string;
    color: string;
    padding: string;
  };
}

const defaultTheme = (theme: any): AppBarContentTheme =>
  merge(
    {
      appBar: {
        totalHeight: '56px',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.on,
        padding: '16px',
      },
    },
    theme
  );

const defaultClasses = {
  root: {},
};

const AppBarContentRootStyles = (theme: AppBarContentTheme) => {
  const appBar = theme.appBar;
  return css`
    height: ${appBar.totalHeight};
    background-color: ${appBar.backgroundColor};
    color: ${appBar.color};
    padding: ${appBar.padding};
  `;
};

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
        <Typography scale={'H6'}>{title}</Typography>
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
