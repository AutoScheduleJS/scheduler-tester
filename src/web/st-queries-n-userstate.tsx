import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { PaddingProps } from './responsive/padding';
import { StQueriesManager } from './st-queries-manager';
import { StUserstateManager } from './st-userstate-manager';
import { Typography } from './typography/typography';
import { merge, mergeProps } from './util/hoc.util';

const themeToTitleStyles = (theme: any) => {
  return {
    className: css`
      color: ${theme.palette.surface.on};
      margin-top: 16px;
    `,
  };
};
const defaultTheme = (theme: any) => merge({ palette: { surface: { on: 'white' } } }, theme);

interface StQueriesNUserstateProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

const containerStyles = {
  className: css`
    display: flex;
  `,
};

const childStyles = {
  className: css`
    flex-grow: 1;
    flex-basis: 0;
  `,
};

class StQueriesNUserstateImpl extends React.PureComponent<StQueriesNUserstateProps> {
  render() {
    const { theme: incomingTheme, ...defaultHostProps } = this.props;
    const theme = defaultTheme(incomingTheme);
    const titleProps = mergeProps(PaddingProps(theme), themeToTitleStyles(theme));
    return (
      <div {...defaultHostProps}>
        <div {...containerStyles}>
          <div {...childStyles}>
            <Typography {...titleProps} scale={'Subtitle1'}>
              Queries
            </Typography>
            <StQueriesManager />
          </div>
          <div {...childStyles}>
            <Typography {...titleProps} scale={'Subtitle1'}>
              User-state
            </Typography>
            <StUserstateManager />
          </div>
        </div>
      </div>
    );
  }
}

export const StQueriesNUserstate = withTheme(StQueriesNUserstateImpl);
