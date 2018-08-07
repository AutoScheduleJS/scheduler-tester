export const getDisplayName = (name: string, ...cmps: Array<React.ComponentType<any>>) =>
  cmps.reduce((acc, cul) => acc + ' + ' + cul.displayName || cul.name || 'Component', name);

const _pipe = (a, b) => (...args) => b(a(...args));
export const pipe = (...ops) => ops.reduce(_pipe);

export const converge = <T extends any>(fn: (...args) => T, ...toArgs: Array<(a) => any>) => (val: any) => fn(...toArgs.map(toArg => toArg(val)));

export const isObject = (obj: any) => {
  return typeof obj === 'object' && obj !== null;
}

/**
 * oldObj: { a: { b: 1 }}
 * newObj: { a: { c: 2 }}
 * result: { a: { b: 1, c: 2 }}
 */
export const merge = (oldObj, newObj) => {
  if (!isObject(oldObj) || !isObject(newObj)) {
    return newObj;
  }
  const result = {...newObj, ...oldObj };
  Object.keys(oldObj).forEach(key => {
    if (newObj.hasOwnProperty(key)) {
      result[key] = merge(oldObj[key], newObj[key]);
    }
  });
  return result;
};