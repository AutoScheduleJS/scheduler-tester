import * as reactSpring from 'react-spring';

declare module 'react-spring' {
  export class AnimatedValue {
    constructor(value: string | number);
    setValue(value: string | number): void;
    interpolate(config: any): any;
    stopAnimation(cb: (v: number) => void): void;
  }

  export function controller(
    value: AnimatedValue,
    config: { to: any }
  ): { start: (cb?: (v: any) => void) => void; stop: () => void };
}
