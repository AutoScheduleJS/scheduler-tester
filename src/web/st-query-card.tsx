import { IQuery, QueryKind } from '@autoschedule/queries-fn';
import { Icon, IconButton } from '@material-ui/core';
import { actionTrigger$ } from '@scheduler-tester/core-state/core.store';
import { EditQueryAction } from '@scheduler-tester/core-state/edit.ui.reducer';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { CardProps } from './card/card';
import { Typography } from './typography/typography';
import { merge, mergeProps } from './util/hoc.util';

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
  openEditDialog() {
    actionTrigger$.next(new EditQueryAction(this.props.query));
  }

  render() {
    const { query, theme: incomingTheme, ...defaultHostProps } = this.props;
    const theme = defaultTheme(incomingTheme);
    const hostProps = mergeProps(CardProps(theme), themeToHostStyle(theme), defaultHostProps);
    return (
      <div {...hostProps}>
        <Typography baselineTop={40} scale="H5">
          {query.name}
        </Typography>
        <Typography scale="Subtitle1" emphase={'medium'}>
          #{query.id}
        </Typography>
        <QueryDisplayKind {...{ query }} />
        <IconButton onClick={this.openEditDialog.bind(this)} aria-label="edit">
          <Icon>edit</Icon>
        </IconButton>
      </div>
    );
  }
}

export const StQueryCard = withTheme(StQueryCardImpl);
