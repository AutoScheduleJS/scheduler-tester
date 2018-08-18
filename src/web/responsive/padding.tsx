import { css } from 'emotion';
import { merge } from '../util/hoc.util';

interface PaddingTheme {
  layout: {
    margin: string;
  };
}

const defaultTheme = (theme: any): PaddingTheme =>
  merge(
    {
      layout: {
        margin: '24px',
      },
    } as PaddingTheme,
    theme
  );

const paddingRootStyles = (theme: PaddingTheme) => {
  const padding = theme.layout.margin;
  return css`
    padding: 0 ${padding};
  `;
};

export const PaddingProps = (customTheme?: any) => {
  const theme = defaultTheme(customTheme);
  return {
    className: paddingRootStyles(theme),
  };
};
