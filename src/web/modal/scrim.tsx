import { ICoreState } from '@scheduler-tester/core-state/core.state';
import { coreState$ } from '@scheduler-tester/core-state/core.store';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { animated, Transition } from 'react-spring';
import { connect } from '../util/connect';
import { merge } from '../util/hoc.util';

interface CustomableProps {
  theme?: any;
}

interface ScrimFromState {
  displayScrim: boolean;
  handleClick?: () => void;
}

interface ScrimProps extends CustomableProps {}

interface ScrimTheme {
  scrim: {
    color: string;
  };
}

const defaultTheme = (
  theme: any = { palette: { surface: { main: '#FFFFFF', on: '#000000' } } }
): ScrimTheme =>
  merge(
    {
      scrim: {
        color: theme.palette.surface.on + '51',
      },
    } as ScrimTheme,
    theme
  );

const themeToScrimClass = (theme: ScrimTheme) => css`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: ${theme.scrim.color};
`;

class ScrimImpl extends React.PureComponent<ScrimProps & ScrimFromState> {
  render() {
    const { displayScrim, handleClick, theme: incomingTheme } = this.props;
    const theme = defaultTheme(incomingTheme);
    return (
      <Transition native from={{ opacity: 0 }} enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
        {displayScrim &&
          (props => (
            <animated.div
              className={themeToScrimClass(theme)}
              onClick={handleClick}
              style={props}
            />
          ))}
      </Transition>
    );
  }
}

const selector = ({ ui }: ICoreState): ScrimFromState => ({
  displayScrim: ui.scrim.displayScrim,
  handleClick: ui.scrim.handleClick,
});

export const Scrim = connect(selector, coreState$)<ScrimProps, ScrimFromState>(
  withTheme(ScrimImpl)
);
