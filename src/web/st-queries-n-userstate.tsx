import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { PaddingProps } from './responsive/padding';
import { StQueriesManager } from './st-queries-manager';
import { Typography } from './typography/typography';
import { mergeProps, merge } from './util/hoc.util';

const themeToTitleStyles = (theme: any) => {
  return {
    className: css`
      color: ${theme.palette.surface.on};
      margin-top: 16px;
    `,
  };
};
const defaultTheme = (theme: any) => merge({ palette: { surface: { on: 'white' } } }, theme);

class StQueriesNUserstateImpl extends React.PureComponent<{ theme?: any }> {
  render() {
    const { theme: incomingTheme } = this.props;
    const theme = defaultTheme(incomingTheme);
    const titleProps = mergeProps(PaddingProps(theme), themeToTitleStyles(theme));
    console.log('titleProps', titleProps);
    return (
      <React.Fragment>
        <Typography {...titleProps} scale={'H6'}>
          Queries
        </Typography>
        <StQueriesManager />
      </React.Fragment>
    );
  }
}

export const StQueriesNUserstate = withTheme(StQueriesNUserstateImpl);
