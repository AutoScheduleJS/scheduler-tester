import { stQuery } from './query';
import { stTimeBoundary } from './time-boundary';
import { stTimeDuration } from './time-duration';
import { stTransformInsert } from './transform-insert';
import { stTransformNeed } from './transform-need';
import { stTransformUpdate } from './transform-update';

export const stQueryCmps = [
  stTimeDuration,
  stTimeBoundary,
  stTransformInsert,
  stTransformNeed,
  stTransformUpdate,
  stQuery,
];