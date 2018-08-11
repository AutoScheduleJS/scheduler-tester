import { IMaterial } from '@autoschedule/queries-scheduler';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { IItemProps } from './timeline';
import { merge, mergeProps } from './util/hoc.util';

interface StMaterialViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
}

interface StMaterialViewerTheme {
  materialViewer: {
    height: string;
  };
}

const defaultTheme = (theme: any): StMaterialViewerTheme =>
  merge(
    {
      materialViewer: {
        height: '72px'
      },
    } as StMaterialViewerTheme,
    theme
  );

const themeToHostStyles = (theme: StMaterialViewerTheme) => css`
  height: ${theme.materialViewer.height};
`;

class StMaterialViewerImpl extends React.PureComponent<
  IItemProps<IMaterial> & StMaterialViewerProps
> {
  render() {
    const { item, theme: incomingTheme, ...defaultHostProps } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(defaultHostProps, {
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
