import { css } from 'emotion';
import { merge } from '../util/hoc.util';

const breakpoints: Breakpoints = {
  xsmall1: 0,
  xsmall2: 360,
  xsmall3: 400,
  xsmall4: 490,
  small1: 600,
  small2: 720,
  small3: 840,
  small4: 960,
  medium1: 1024,
  medium2: 1280,
  large1: 1440,
  large2: 1600,
  xlarge: 1920,
};

interface Breakpoints {
  xsmall1?: number;
  xsmall2?: number;
  xsmall3?: number;
  xsmall4?: number;
  small1?: number;
  small2?: number;
  small3?: number;
  small4?: number;
  medium1?: number;
  medium2?: number;
  large1?: number;
  large2?: number;
  xlarge?: number;
}

interface PaddingTheme {
  padding: Breakpoints;
}

const defaultTheme = (theme: any): PaddingTheme =>
  merge(
    {
      padding: {
        small2: 24,
      },
    },
    theme
  );

const paddingRootStyles = (theme: PaddingTheme) => {
  const padding = theme.padding;
  const paddingStyles = Object.entries(padding).reduce(
    (acc, [key, val]) => acc + `@media (min-width: ${breakpoints[key]}px) { padding: 0 ${val}px };`,
    ''
  );
  console.log(paddingStyles);
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
