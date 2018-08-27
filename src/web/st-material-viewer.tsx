import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { ElevationProps } from './elevation/elevation';
import { IMaterialUI } from './st-demo-viewer';
import { IItemProps } from './st-timeline';
import { merge, mergeProps } from './util/hoc.util';
import { Typography, TypographyProps } from './typography/typography';

interface StMaterialViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

interface StMaterialViewerTheme {
  materialViewer: {
    height: string;
    backgroundColor: string;
    color: string;
  };
}

const defaultTheme = (theme: any): StMaterialViewerTheme =>
  merge(
    {
      materialViewer: {
        height: '72px',
        backgroundColor: theme.palette.surface.main,
        color: theme.palette.surface.on,
      },
    } as StMaterialViewerTheme,
    theme
  );

const themeToHostStyles = (theme: StMaterialViewerTheme) => {
  const mv = theme.materialViewer;
  return css`
    height: ${mv.height};
    background-color: ${mv.backgroundColor};
    color: ${mv.color};
    padding: 16px;
    border-radius: 16px;
  `;
};

class StMaterialViewerImpl extends React.PureComponent<
  IItemProps<IMaterialUI> & StMaterialViewerProps
> {
  render() {
    const { item, theme: incomingTheme, ...defaultHostProps } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(defaultHostProps, ElevationProps(1, theme), {
      className: themeToHostStyles(theme),
    });
    const nameProps = mergeProps(TypographyProps('Subtitle1', 0, undefined, theme), {
      className: css`
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      `,
    });
    return (
      <React.Fragment>
        <div {...hostProps}>
          <div {...nameProps}>{item.name}</div>
          <Typography scale={'Overline'} baselineTop={20}>
            #{item.queryId}
          </Typography>
        </div>
      </React.Fragment>
    );
  }
}

export const StMaterialViewer = withTheme(StMaterialViewerImpl);
