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
      fill: blue;
      fill-opacity: 0.2;
      stroke: blue;
    `,
  };
};

class LineAreaImpl extends React.PureComponent<LineAreaProps> {
  render() {
    const { width, height, forwardedRef, theme: incomingTheme, ...defaultHostProps } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(themeToClass(theme), defaultHostProps);
    return (
      <svg
        width={width}
        height={height}
        ref={forwardedRef}
        {...hostProps}
        viewBox={`0 -10 ${width} ${height}`}
      >
        <path {...lineClass(theme)} d={`M0,50 Q15,50 20,25 T40,0 100,0 Q115,0 120,25 T140,50`} />
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
