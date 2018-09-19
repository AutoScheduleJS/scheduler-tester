import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { Ref } from 'react';
import { merge, mergeProps } from '../util/hoc.util';

interface CustomableProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

export interface LineAreaProps extends CustomableProps {
  width: number;
  height: number;
  division: number;
  points: [number, number][];
  forwardedRef?: Ref<HTMLDivElement>;
}

interface LineAreaTheme {
  lineArea: {};
}

const defaultTheme = (theme: any): LineAreaTheme => merge({}, theme);
const themeToClass = theme => {
  console.log(theme);
  return {
    className: css``,
  };
};

const lineClass = (theme: any) => {
  console.log(theme);
  return {
    className: css`
      stroke-width: 2;
      fill: #81d4fa;
      fill-opacity: 0.2;
      stroke: #81d4fa;
    `,
  };
};

const abscisseClass = (theme: any) => {
  console.log(theme);
  return css`
    stroke-width: 1;
    stroke: white;
  `;
};

const pointsToPath = (points: [number, number][]): string => {
  const drag = 20;
  const [first, second, ...others] = points;
  const initialPath = `M${first[0]},${first[1]} C${first[0] + drag},${first[1]} ${second[0] -
    drag},${second[1]} ${second[0]},${second[1]}`;
  return others.reduce(
    (acc, cur) => `${acc} S${cur[0] - drag},${cur[1]} ${cur[0]}, ${cur[1]}`,
    initialPath
  );
};

const divisorClass = (theme: any) => {
  console.log(theme);
  return css`
    stroke-width: 1;
    stroke: #81d4fa;
    fill: #81d4fa;
    fill-opacity: 0.2;
  `;
};

const createDivisors = (division: number, width: number, theme: any) => {
  const step = width / division;
  return Array(division).fill(null).map((_, i) => (
    <circle cx={i * step} cy={51} r={3} className={divisorClass(theme)} />
  ));
};

class LineAreaImpl extends React.PureComponent<LineAreaProps> {
  render() {
    const {
      width,
      height,
      points,
      division,
      forwardedRef,
      theme: incomingTheme,
      ...defaultHostProps
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(themeToClass(theme), defaultHostProps);
    const path = pointsToPath(points);
    const divisors = createDivisors(division, width, theme);
    console.log('divisors', divisors);
    return (
      <svg
        width={width}
        height={height}
        ref={forwardedRef}
        {...hostProps}
        viewBox={`-10 -10 ${width} ${height}`}
      >
        <path {...lineClass(theme)} d={path} />
        <line x1={0} y1={51} x2={width} y2={51} className={abscisseClass(theme)} />
        {divisors}
      </svg>
    );
  }
}

/**
 * forwardRef must be the last to export.
 */
const LineAreaImplWithTheme = withTheme(LineAreaImpl);

export const LineArea = React.forwardRef<HTMLDivElement, LineAreaProps>((props, ref) => (
  <LineAreaImplWithTheme {...props} forwardedRef={ref} />
));
