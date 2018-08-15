export const breakpoints: Breakpoints = {
  xsmall1: 0,
  xsmall2: 360,
  xsmall3: 400,
  xsmall4: 490,
  small1: 600,
  small2: 720,
  small3: 840,
  small4: 960,
  medium1: 1024,
  medium2: 1280,
  large1: 1440,
  large2: 1600,
  xlarge: 1920,
};

export interface Breakpoints {
  xsmall1?: number;
  xsmall2?: number;
  xsmall3?: number;
  xsmall4?: number;
  small1?: number;
  small2?: number;
  small3?: number;
  small4?: number;
  medium1?: number;
  medium2?: number;
  large1?: number;
  large2?: number;
  xlarge?: number;
}
