import { IQueryInternal, IQueryTransformationInternal } from '@autoschedule/queries-fn';

export const pushTransform = (
  q: IQueryInternal,
  kind: keyof IQueryTransformationInternal,
  transform: any
): IQueryInternal => {
  const transforms = q.transforms || { needs: [], deletes: [], updates: [], inserts: [] };
  const newTransform = [...transforms[kind], transform];
  return { ...q, transforms: { ...transforms, [kind]: newTransform } };
};

export const updateTransform = (
  q: IQueryInternal,
  kind: keyof IQueryTransformationInternal,
  oldTransform: any,
  newTransform: any
): IQueryInternal => {
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
