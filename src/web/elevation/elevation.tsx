import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { nodeWrapper } from '../node-wrapper/node-wrapper';
import { merge, prepareProps } from '../util/hoc.util';

interface CustomableProps extends React.HTMLAttributes<HTMLDivElement> {
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

const defaultTheme = (theme: any): ElevationTheme =>
  merge(
    {
      shadows: {
        baselineColor: '#000000',
      },
    },
    theme
  );

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
  const color = theme.shadows.baselineColor;
  const eleIndex = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24]
    .map((val, i) => ({ elevation: val, distance: Math.abs(val - elevation), index: i }))
    .reduce((acc, cur) => (acc.distance < cur.distance ? acc : cur)).index;
  const umbraColor = color + umbraOpacity;
  const penumbraColor = color + penumbraOpacity;
  const ambiantColor = color + ambientOpacity;
  return css`
    transition: box-shadow 100ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${umbraZValue[eleIndex]} ${umbraColor}, ${penumbraZValue[eleIndex]} ${penumbraColor},
      ${ambiantZValue[eleIndex]} ${ambiantColor};
  `;
};

class ElevationImpl extends React.PureComponent<ElevationProps> {
  render() {
    const { children, elevation, theme: incomingTheme, classes = defaultClasses } = this.props;
    const theme = defaultTheme(incomingTheme);
    return nodeWrapper({
      className: css`
        ${ElevationRootStyles(theme, elevation)} ${classes.root};
      `,
    })(children);
  }
}

export const ElevationHOC = <T extends { className: string }>(
  elevation: number,
  customTheme?: any
) => (Cmp: React.ComponentType<T>) =>
  class Elevation extends React.PureComponent<T> {
    public render() {
      const theme = defaultTheme(customTheme);
      const { className, props } = prepareProps(this.props);
      return (
        <Cmp
          {...props}
          className={css`
            ${ElevationRootStyles(theme, elevation)} ${className};
          `}
        />
      );
    }
  };

export const ElevationProps = (elevation: number, customTheme?: any) => {
  const theme = defaultTheme(customTheme);
  return {
    className: ElevationRootStyles(theme, elevation),
  };
};

export const ElevationPressHOC = <T extends { className: string }>(
  inactive: number,
  active: number,
  customTheme?: any
) => (Cmp: React.ComponentType<T>) =>
  class ElevationPress extends React.PureComponent<T> {
    state = {
      elevation: inactive,
    };
    private handleMouseDown() {
      this.setState({
        elevation: active,
      });
      addEventListener('mouseup', this.handleMouseUp.bind(this));
    }
    private handleMouseUp() {
      this.setState({
        elevation: inactive,
      });
      removeEventListener('mouseup', this.handleMouseUp);
    }

    public render() {
      const theme = defaultTheme(customTheme);
      const { className, props } = prepareProps(this.props);
      const { elevation } = this.state;
      return (
        <Cmp
          {...props}
          className={css`
            ${ElevationRootStyles(theme, elevation)} ${className};
          `}
          onMouseDown={this.handleMouseDown.bind(this)}
        />
      );
    }
  };

export const ElevationPropsPress = (
  inactive: number,
  active: number,
  state: { elevation: number },
  setState: (v: any) => void,
  customTheme?: any
) => {
  const theme = defaultTheme(customTheme);
  let elevation = state.elevation;
  const handleMouseDown = () => {
    setState({
      elevation: active,
    });
    addEventListener('mouseup', handleMouseUp);
  };
  const handleMouseUp = () => {
    setState({
      elevation: inactive,
    });
    removeEventListener('mouseup', handleMouseUp);
  };
  return {
    className: ElevationRootStyles(theme, elevation),
    onMouseDown: handleMouseDown,
  };
};

export const Elevation = withTheme(ElevationImpl);
