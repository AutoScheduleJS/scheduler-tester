import { css } from 'emotion';

export const displayFlex = css`
  display: flex;
`;
export const flexShrink = (val: number) => css`
  flex-shrink: ${val};
`;
export const flexGrow = (val: number) => css`
  flex-grow: ${val};
`;
export const maxWidth = (val: string) => css`
  max-width: ${val};
`;
export const minWidth = (val: string) => css`
  min-width: ${val};
`;
export const padding = (a: string, b?: string, c?: string, d?: string) => css`
  padding: ${a} ${b} ${c} ${d};
`
export const width = (val: string) => css`
  width: ${val};
`