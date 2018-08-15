import { css } from 'emotion';
import { merge } from '../util/hoc.util';
import { Breakpoints, breakpoints } from './breakpoints';

interface PaddingTheme {
  padding: Breakpoints;
}

const defaultTheme = (theme: any): PaddingTheme =>
  merge(
    {
      padding: {
        xsmall1: 16,
        small2: 24,
      },
    } as PaddingTheme,
    theme
  );

const paddingRootStyles = (theme: PaddingTheme) => {
  const padding = theme.padding;
  const paddingStyles = Object.entries(padding).reduce(
    (acc, [key, val]) => acc + `@media (min-width: ${breakpoints[key]}px) { padding: 0 ${val}px };`,
    ''
  );
  return css`
    ${paddingStyles};
  `;
};

export const PaddingProps = (customTheme?: any) => {
  const theme = defaultTheme(customTheme);
  return {
    className: paddingRootStyles(theme),
  };
};
