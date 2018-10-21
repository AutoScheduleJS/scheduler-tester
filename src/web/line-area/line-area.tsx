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
  abscissaUnit: number;
  ordinateUnit: number;
  division: number;
  points: [number, number][];
  forwardedRef?: Ref<HTMLDivElement>;
}

interface LineAreaTheme {
  chart: {
    palette: {
      stroke: string;
      fill: string;
      fillOpacity: number;
      pointColor: string;
    };
  };
}

const defaultTheme = (theme: any): LineAreaTheme =>
  merge(
    {
      chart: {
        palette: {
          stroke: theme.palette.secondary.main,
          fill: theme.palette.secondary.main,
          fillOpacity: 0.2,
          pointColor: theme.palette.secondary.on,
        },
      },
    },
    theme
  );

const themeToClass = theme => {
  console.log(theme);
  return {
    className: css``,
  };
};

const lineClass = (theme: LineAreaTheme) => {
  const chart = theme.chart;
  return {
    className: css`
      stroke-width: 2;
      fill: ${chart.palette.fill};
      fill-opacity: ${chart.palette.fillOpacity};
      stroke: ${chart.palette.stroke};
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
  const drag = 5; // should be a factor of second[0] - first[0]
  const [first, second, ...others] = points;
  const initialPath = `M${first[0]},${first[1]} C${first[0] + drag},${first[1]} ${second[0] -
    drag},${second[1]} ${second[0]},${second[1]}`;
  return others.reduce(
    (acc, cur) => `${acc} S${cur[0] - drag},${cur[1]} ${cur[0]}, ${cur[1]}`,
    initialPath
  );
};

const divisorClass = (theme: LineAreaTheme) => {
  return css`
    stroke-width: 0;
    fill: ${theme.chart.palette.pointColor};
    fill-opacity: 1;`;
};

const createDivisors = (division: number, width: number, height: number, theme: any) => {
  const step = width / division;
  return Array(division + 1)
    .fill(null)
    .map((_, i) => <circle cx={i * step} cy={height} r={1} className={divisorClass(theme)} />);
};

class LineAreaImpl extends React.PureComponent<LineAreaProps> {
  render() {
    const {
      width,
      height,
      points,
      division,
      abscissaUnit,
      ordinateUnit,
      forwardedRef,
      theme: incomingTheme,
      ...defaultHostProps
    } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(themeToClass(theme), defaultHostProps);
    const baseHeight = ordinateUnit;
    const path = pointsToPath(
      points.map(pair => [pair[0] * abscissaUnit, pair[1] * baseHeight] as [number, number])
    );
    const divisors = createDivisors(division, width, baseHeight, theme);
    const widthMargin = 3;
    return (
      <svg
        width={width + widthMargin * 2}
        height={height}
        ref={forwardedRef}
        {...hostProps}
        viewBox={`-${widthMargin} -10 ${width + widthMargin * 2} ${height}`}
      >
        <path {...lineClass(theme)} d={path} />
        <line x1={0} y1={baseHeight} x2={width} y2={baseHeight} className={abscisseClass(theme)} />
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
