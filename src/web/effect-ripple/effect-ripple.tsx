import { css, cx } from 'emotion';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import { merge } from '../util/hoc.util';

interface CustomableProps {
  classes?: {
    root?: string;
  };
  theme?: any;
}

interface EffectRippleProps extends CustomableProps {}

interface EffectRippleTheme {
  effectRiple: {
    color: string;
    duration: number;
    shape: string;
  };
}

const defaultTheme = (theme: any): EffectRippleTheme =>
  merge(
    {
      effectRiple: {
        color: theme.palette.primary.on,
        duration: 600,
        shape: css`
          border-radius: 50%;
        `,
      },
    },
    theme
  );

const defaultClasses = {
  root: '',
};

const ripple = (e, theme: EffectRippleTheme) => {
  const eventListener = 'mousedown';
  const duration = theme.effectRiple.duration;
  const rippleColor = theme.effectRiple.color;
  const clickedEl = e.currentTarget;
  const PageX = eventListener.match(/touch/) ? e.changedTouches[0].pageX : e.clientX;
  const PageY = eventListener.match(/touch/) ? e.changedTouches[0].pageY : e.clientY;
  const btnWidth = clickedEl.clientWidth;
  const el = clickedEl.getBoundingClientRect();
  const rippleX = PageX - el.left;
  const rippleY = PageY - el.top;

  const baseCSS = cx(
    css`
      position: absolute;
      width: ${btnWidth * 2}px;
      height: ${btnWidth * 2}px;
      transition: transform ${duration}ms, opacity ${duration}ms;
      transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      background-color: ${rippleColor};
      opacity: 0.12;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
      left: ${rippleX - btnWidth}px;
      top: ${rippleY - btnWidth}px;
      transform: scale(0);
      pointer-events: none;
    `,
    theme.effectRiple.shape
  );

  const rippleElem = document.createElement('span');
  rippleElem.className = baseCSS;

  // Add some css for prevent overflow errors
  clickedEl.style.overflow = 'hidden';

  // Check if the element is not static because the ripple is in absolute
  if (window.getComputedStyle(clickedEl).position === 'static') {
    clickedEl.style.position = 'relative';
  }

  clickedEl.appendChild(rippleElem);

  // start animation
  setTimeout(() => {
    rippleElem.className = css`
      ${baseCSS} ${css`
        transform: scale(1);
      `};
    `;
  }, 0);

  const onMouseUp = () => {
    rippleElem.className = css`
      ${baseCSS} ${css`
        transform: scale(1);
        opacity: 0;
      `};
    `;
    setTimeout(() => {
      rippleElem.remove();
      removeEventListener('mouseup', onMouseUp);
    }, theme.effectRiple.duration);
  };
  addEventListener('mouseup', onMouseUp);
};

class EffectRippleImpl extends React.PureComponent<EffectRippleProps> {
  render() {
    const { theme: incomingTheme, classes = defaultClasses, children } = this.props;
    const theme = defaultTheme(incomingTheme);
    return (
      <div className={classes.root} onMouseDown={e => ripple(e, theme)}>
        {children}
      </div>
    );
  }
}

export const EffectRipple = withTheme(EffectRippleImpl);

export const EffectRippleHOC = <T extends { className: string }>(customTheme?: any) => (
  Cmp: React.ComponentType<T>
) =>
  class Elevation extends React.PureComponent<T> {
    public render() {
      const theme = defaultTheme(customTheme);
      const { className } = this.props;
      const props: any = Object.assign({}, this.props);
      delete props.className; // workaround for TS issue 'spread object of generic type'
      return <Cmp {...props} className={className} onMouseDown={e => ripple(e, theme)} />;
    }
  };

export const EffectRippleProps = (customTheme: any) => {
  const theme = defaultTheme(customTheme);
  return {
    onMouseDown: e => ripple(e, theme),
  };
};
