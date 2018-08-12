import { IMaterial } from '@autoschedule/queries-scheduler';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { IItemProps } from './timeline';
import { merge, mergeProps } from './util/hoc.util';
import { ElevationProps } from './elevation/elevation';

interface StMaterialViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

interface StMaterialViewerTheme {
  materialViewer: {
    height: string;
    backgroundColor: string;
  };
}

const defaultTheme = (theme: any): StMaterialViewerTheme =>
  merge(
    {
      materialViewer: {
        height: '72px',
        backgroundColor: theme.palette.primary.lightVariant,
      },
    } as StMaterialViewerTheme,
    theme
  );

const themeToHostStyles = (theme: StMaterialViewerTheme) => {
  const mv = theme.materialViewer;
  return css`
    height: ${mv.height};
    background-color: ${mv.backgroundColor};
    padding: 16px;
    border-radius: 4px;
  `;
};

class StMaterialViewerImpl extends React.PureComponent<
  IItemProps<IMaterial> & StMaterialViewerProps
> {
  render() {
    const { item, theme: incomingTheme, ...defaultHostProps } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(defaultHostProps, ElevationProps(1, theme), {
      className: themeToHostStyles(theme),
    });
    return (
      <div {...hostProps}>
        {item.queryId}-{item.materialId}|{item.end - item.start}
      </div>
    );
  }
}

export const StMaterialViewer = withTheme(StMaterialViewerImpl);
