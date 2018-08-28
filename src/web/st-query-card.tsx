import { IQuery, QueryKind } from '@autoschedule/queries-fn';
import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { EditQueryAction } from '@scheduler-tester/core-state/edit.ui.reducer';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { TappableProps } from './button/button';
import { CardProps } from './card/card';
import { Typography } from './typography/typography';
import { merge, mergeProps, stateHandler } from './util/hoc.util';

interface IqueryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: any;
  query: IQuery;
}

const QueryDisplayKind: React.SFC<{ query: IQuery }> = ({ query }) => {
  const kind = query.kind;
  return (
    <Typography scale="Body1">
      Query kind: {kind === QueryKind.Atomic ? 'atomic' : 'placeholder'}
    </Typography>
  );
};

const themeToHostStyle = (theme: StQueryCardTheme) => {
  return {
    className: css`
      padding: 0 ${theme.editableCard.padding}px;
    `,
  };
};

interface StQueryCardTheme {
  editableCard: {
    padding: number;
  };
}

const defaultTheme = (theme: any) =>
  merge(
    {
      editableCard: {
        padding: 16,
      },
    } as StQueryCardTheme,
    theme
  );

class StQueryCardImpl extends React.PureComponent<IqueryCardProps> {
  state = {
    card: {
      elevation: 1,
    },
  };

  openEditDialog() {
    console.log('Open query !');
    actionTrigger$.next(new EditQueryAction(this.props.query));
  }

  render() {
    const { query, theme: incomingTheme, ...defaultHostProps } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(
      CardProps({
        customTheme: theme,
        isClickable: true,
        stateHandler: stateHandler(this, 'card'),
      }),
      themeToHostStyle(theme),
      TappableProps(theme),
      {
        onClick: this.openEditDialog.bind(this),
      },
      defaultHostProps
    );
    return (
      <div {...hostProps}>
        <Typography baselineTop={40} scale="H5">
          {query.name}
        </Typography>
        <Typography scale="Subtitle1" emphase={'medium'}>
          #{query.id}
        </Typography>
        <QueryDisplayKind {...{ query }} />
      </div>
    );
  }
}

export const StQueryCard = withTheme(StQueryCardImpl);
