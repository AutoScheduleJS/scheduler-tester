import { css } from 'emotion';
import { ElevationProps } from '../elevation/elevation';
import { merge, mergeProps } from '../util/hoc.util';

interface CardTheme {
  card: {
    elevation: number;
    color: string;
    backgroundColor: string;
    shape: string;
  };
}

const defaultTheme = (
  theme: any = { palette: { surface: { main: '#FFF', on: '#00000099' } } }
): CardTheme =>
  merge(
    {
      card: {
        elevation: 1,
        backgroundColor: theme.palette.surface.main,
        color: theme.palette.surface.on,
        shape: css`
          border-radius: 4px;
        `,
      },
    } as CardTheme,
    theme
  );

const themeToClassname = (theme: CardTheme) => ({
  className: css`
    background-color: ${theme.card.backgroundColor};
    color: ${theme.card.color};
    ${theme.card.shape};
  `,
});

export const CardProps = (customTheme?: any) => {
  const theme = defaultTheme(customTheme);
  return mergeProps(ElevationProps(theme.card.elevation, customTheme), themeToClassname(theme));
};
