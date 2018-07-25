import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';

interface CustomableProps {
  classes?: {
    root: string;
  };
  theme?: any;
}

interface ElevationProps extends CustomableProps {
  elevation: number;
}

interface ElevationTheme {
  shadows: {
    baselineColor: string;
  };
}

const defaultTheme = (theme: any): ElevationTheme => ({
  shadows: {
    baselineColor: '#000000',
    ...theme.shadows,
  },
});

const defaultClasses = {
  root: {},
};

const umbraOpacity = '33';
const penumbraOpacity = '24';
const ambientOpacity = '1F';

const umbraZValue: ReadonlyArray<string> = [
  '0px 0px 0px 0px',
  '0px 2px 1px -1px',
  '0px 3px 1px -2px',
  '0px 3px 3px -2px',
  '0px 2px 4px -1px',
  '0px 3px 5px -1px',
  '0px 5px 5px -3px',
  '0px 7px 8px -4px',
  '0px 8px 10px -5px',
  '0px 11px 15px -7px',
];

const penumbraZValue: ReadonlyArray<string> = [
  '0px 0px 0px 0px',
  '0px 1px 1px 0px',
  '0px 2px 2px 0px',
  '0px 3px 4px 0px',
  '0px 4px 5px 0px',
  '0px 6px 10px 0px',
  '0px 8px 10px 1px',
  '0px 12px 17px 2px',
  '0px 16px 24px 2px',
  '0px 24px 38px 3px',
];

const ambiantZValue: ReadonlyArray<string> = [
  '0px 0px 0px 0px',
  '0px 1px 3px 0px',
  '0px 1px 5px 0px',
  '0px 1px 8px 0px',
  '0px 1px 10px 0px',
  '0px 1px 18px 0px',
  '0px 3px 14px 2px',
  '0px 5px 22px 4px',
  '0px 6px 30px 5px',
  '0px 9px 46px 8px',
];

const ElevationRootStyles = (theme: ElevationTheme, elevation: number) => {
  const eleIndex = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24]
    .map((val, i) => ({ elevation: val, distance: Math.abs(val - elevation), index: i }))
    .reduce((acc, cur) => (acc.distance < cur.distance ? acc : cur)).index;
  return css`
    box-shadow: ${umbraZValue[eleIndex]} ${theme.shadows.baselineColor} ${umbraOpacity},
      ${penumbraZValue[eleIndex]} ${theme.shadows.baselineColor} ${penumbraOpacity},
      ${ambiantZValue[eleIndex]} ${theme.shadows.baselineColor} ${ambientOpacity};
  `;
};

class ElevationImpl extends React.PureComponent<ElevationProps> {
  render() {
    const { children, elevation, theme: incomingTheme, classes = defaultClasses } = this.props;
    const theme = defaultTheme(incomingTheme);
    return (
      <div
        className={css`
          ${ElevationRootStyles(theme, elevation)} ${classes.root};
        `}
      >
        {children}
      </div>
    );
  }
}

export const Elevation = withTheme(ElevationImpl);