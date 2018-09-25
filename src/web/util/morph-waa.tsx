import { css } from 'emotion';
import * as React from 'react';
import { mergeProps } from './hoc.util';

interface MorphWaaProps {
  state: 'from' | 'to';
  FromElem: React.ComponentType<any>;
  ToElem: React.ComponentType<any>;
  [key: string]: any;
  fromProps?: any;
  toProps?: any;
  keepFrom?: boolean;
}

interface MorphWaaState {
  state: 'from' | 'to';
  toOpacity: number;
  fromOpacity: number;
  animate: boolean;
}

interface ChildInfo {
  box: IBox;
  clone: HTMLElement;
}

/**
 * when state change: save data-key from 'from'
 * save location/additional info
 * dom change
 * save location/additional info from 'to'
 * make 'to' invisible
 * create div in absolute position for 'to' and 'from'
 * make them move
 * when done, remove them and change 'to' opacity to be visible
 */
export class MorphWaa extends React.Component<MorphWaaProps> {
  state: MorphWaaState = {
    state: 'from',
    toOpacity: 0,
    fromOpacity: 1,
    animate: false,
  };

  private fromNode: HTMLDivElement | undefined; // to compute location just before animation start - prevent false location du to another animation
  private fromInfo: ChildInfo | undefined;
  private toInfo: ChildInfo | undefined;
  private fromClones: HTMLElement[] = [];
  private toClones: HTMLElement[] = [];

  static getDerivedStateFromProps(props: MorphWaaProps, state: MorphWaaState) {
    if (props.state === state.state) {
      return null;
    }
    return { state: props.state, animate: true, toOpacity: 0, fromOpacity: 0 };
  }

  animate = () => {
    if (!this.fromInfo || !this.toInfo) {
      return setTimeout(() => this.animate(), 0);
    }
    if (this.fromNode) {
      this.fromInfo = elemToChildInfo(this.fromNode);
    }
    const isForward = this.state.state === 'to';
    const fromClone = setStylesFromBox(this.fromInfo);
    const toClone = setStylesFromBox(this.toInfo);

    this.fromClones.push(document.body.appendChild(fromClone));
    this.toClones.push(document.body.appendChild(toClone));

    const duration = 200;
    const direction = isForward ? 'normal' : 'reverse';
    const fromAnim = fromClone.animate(
      [
        {
          opacity: 1,
          transform: neutralScale,
        },
        {
          opacity: 0,
          transform: boxesToTransform(this.toInfo.box, this.fromInfo.box),
        },
      ] as any[],
      {
        duration,
        direction,
      }
    );
    const toAnim = toClone.animate(
      [
        { opacity: 0, transform: boxesToTransform(this.fromInfo.box, this.toInfo.box) },
        {
          opacity: 1,
          transform: neutralScale,
        },
      ] as any[],
      {
        duration,
        direction,
      }
    );
    // setTimeout(() => {
    //   toAnim.pause();
    //   fromAnim.pause();
    // }, 150);
    toAnim.onfinish = () => {
      this.fromClones = [];
      this.toClones = [];
      document.body.removeChild(fromClone);
      document.body.removeChild(toClone);
      this.setState({
        toOpacity: isForward ? 1 : 0,
        animate: false,
        fromOpacity: isForward ? 0 : 1,
      });
    };
  };

  from = (): any => ({
    ref: (node: HTMLDivElement) => {
      if (!node || this.fromInfo) {
        return;
      }
      this.fromNode = node;
      this.fromInfo = elemToChildInfo(node);
    },
  });

  to = (): any => ({
    ref: (node: HTMLDivElement) => {
      if (!node) {
        return;
      }
      this.toInfo = elemToChildInfo(node);
    },
  });

  render() {
    const {
      FromElem,
      ToElem,
      fromProps: defaultFromProps,
      toProps: defaultToProps,
      keepFrom,
      ...defaultProps
    } = this.props;
    const { fromOpacity, toOpacity } = this.state;
    if (this.state.animate && !this.fromClones.length) {
      this.animate();
    }
    const fromProps = mergeProps(
      this.from(),
      opacityToClassname(fromOpacity),
      defaultProps,
      defaultFromProps
    );
    const toProps = mergeProps(
      this.to(),
      opacityToClassname(toOpacity),
      defaultProps,
      defaultToProps
    );
    return (
      <React.Fragment>
        {(this.state.state === 'from' || keepFrom) && <FromElem {...fromProps} />}
        {this.state.state === 'to' && <ToElem {...toProps} />}
      </React.Fragment>
    );
  }
}

const opacityToClassname = (opacity: number) => ({
  className: css`
    opacity: ${opacity};
  `,
});

const elemToChildInfo = (elm: HTMLDivElement): ChildInfo => {
  return {
    box: getBox(elm),
    clone: elm.cloneNode(true) as HTMLElement,
  };
};

interface IBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

const setStylesFromBox = ({ box, clone }: ChildInfo) => {
  clone.style.transformOrigin = 'top left';
  clone.style.position = 'absolute';
  clone.style.top = box.top + 'px';
  clone.style.left = box.left + 'px';
  clone.style.width = box.width + 'px';
  clone.style.height = box.height + 'px';
  return clone;
};

const neutralScale = 'scale(1, 1) translate(0, 0)';

const boxesToTransform = (a: IBox, b: IBox) => {
  const [scaleX, scaleY, translateX, translateY] = diffRect(a, b);
  return `matrix(${scaleX}, 0, 0, ${scaleY}, ${translateX}, ${translateY})`;
};

const diffRect = (a: IBox, b: IBox, scale?: boolean) => {
  const scaleY = a.height / b.height;
  const scaleX = a.width / b.width;
  const translateY = a.top - b.top;
  const translateX = a.left - b.left;
  return scale
    ? [scaleX, scaleY, translateX / scaleX, translateY / scaleY]
    : [scaleX, scaleY, translateX, translateY];
};

const getBox = (elm: HTMLDivElement): IBox => {
  const box = elm.getBoundingClientRect();
  const iBox = {
    top: box.top + window.scrollY,
    left: box.left + window.scrollX,
    width: box.width,
    height: box.height,
  };
  return iBox;
};
