import { css } from 'emotion';
import { ElevationProps, ElevationPropsHover } from '../elevation/elevation';
import { IStateHandler, merge, mergeProps } from '../util/hoc.util';

interface CardTheme {
  card: {
    restElevation: number;
    activeElevation: number;
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
        restElevation: 1,
        activeElevation: 8,
        backgroundColor: theme.palette.surface.main,
        color: theme.palette.surface.on,
        shape: css`
          border-radius: 4px;
        `,
      },
    } as CardTheme,
    theme
  );

const themeToClassname = (theme: CardTheme, isClickable: boolean | undefined) => ({
  className: css`
    background-color: ${theme.card.backgroundColor};
    color: ${theme.card.color};
    user-select: ${isClickable ? 'none' : 'auto'};
    ${theme.card.shape};
  `,
});

export const CardProps = (options: {
  customTheme?: any;
  isClickable?: boolean;
  stateHandler?: IStateHandler;
}) => {
  const { customTheme, isClickable } = options;
  const theme = defaultTheme(customTheme);
  const card = theme.card;
  const elevation = isClickable
    ? ElevationPropsHover(
        options.stateHandler as IStateHandler,
        card.restElevation,
        card.activeElevation,
        theme
      )
    : ElevationProps(card.restElevation, theme);
  return mergeProps(elevation, themeToClassname(theme, isClickable));
};
