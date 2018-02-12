import { css } from 'emotion';

export const displayFlex = css`
  display: flex;
`;
export const minWidth = (val: string) => css`
  min-width: ${val};
`;
export const flexShrink = (val: number) => css`
  flex-shrink: ${val};
`;
export const flexGrow = (val: number) => css`
  flex-grow: ${val};
`;