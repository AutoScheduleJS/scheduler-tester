import { merge } from '../util/hoc.util';
import { ElevationProps } from '../elevation/elevation';

interface CardTheme {
  card: {
    elevation: number;
  };
}

const defaultTheme = (theme: any): CardTheme =>
  merge(
    {
      card: {
        elevation: 1,
      },
    } as CardTheme,
    theme
  );

export const CardProps = (customTheme?: any) => {
  const theme = defaultTheme(customTheme);
  return ElevationProps(theme.card.elevation, customTheme);
};
