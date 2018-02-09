import { IAtomicQuery, IGoalQuery, ITransformation } from '@autoschedule/queries-fn';

export type wholeQuery = IAtomicQuery & IGoalQuery;

export const pushTransform = (
  q: wholeQuery,
  kind: keyof ITransformation,
  transform: any
): wholeQuery => {
  const transforms = q.transforms || { needs: [], deletes: [], updates: [], inserts: [] };
  const newTransform = [...transforms[kind], transform];
  return { ...q, transforms: { ...transform, [kind]: newTransform } };
};

export const updateTransform = (
  q: wholeQuery,
  kind: keyof ITransformation,
  oldTransform: any,
  newTransform: any
): wholeQuery => {
  const transforms = q.transforms || { needs: [], deletes: [], updates: [], inserts: [] };
  const newTransforms = (transforms[kind] as ReadonlyArray<any>).map(
    t => (t !== oldTransform ? t : newTransform)
  );
  return { ...q, transforms: { ...transforms, [kind]: newTransforms } };
};

export const parseValue = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (_) {
    return undefined;
  }
};
