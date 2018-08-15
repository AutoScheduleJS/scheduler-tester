import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Typography } from '../typography/typography';
import { merge, mergeProps } from '../util/hoc.util';
import { PaddingProps } from '../responsive/padding';

interface CustomableProps extends React.HTMLAttributes<HTMLDivElement> {
  classes?: {};
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
  };
}

const defaultTheme = (theme: any): AppBarContentTheme =>
  merge(
    {
      appBar: {
        totalHeight: '56px',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.on,
      },
    } as AppBarContentTheme,
    theme
  );

const defaultClasses = {};

const AppBarContentRootStyles = (theme: AppBarContentTheme) => {
  const appBar = theme.appBar;
  return css`
    position: relative;
    height: ${appBar.totalHeight};
    background-color: ${appBar.backgroundColor};
    color: ${appBar.color};
  `;
};

class AppBarContentImpl extends React.PureComponent<AppBarContentProps> {
  render() {
    const {
      theme: incomingTheme,
      classes = defaultClasses,
      title = '',
      ...defaultHostProps
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(defaultHostProps, PaddingProps(theme), {
      className: AppBarContentRootStyles(theme),
    });
    return (
      <div {...hostProps}>
        <Typography scale={'H6'} baselineBottom={20} >{title}</Typography>
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
