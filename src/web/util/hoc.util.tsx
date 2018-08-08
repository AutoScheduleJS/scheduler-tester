import { css } from "emotion";

export const getDisplayName = (name: string, ...cmps: Array<React.ComponentType<any>>) =>
  cmps.reduce((acc, cul) => acc + ' + ' + cul.displayName || cul.name || 'Component', name);

const _pipe = (a, b) => (...args) => b(a(...args));
export const pipe = (...ops) => ops.reduce(_pipe);

export const converge = <T extends any>(fn: (...args) => T, ...toArgs: Array<(a) => any>) => (
  val: any
) => fn(...toArgs.map(toArg => toArg(val)));

export const isObject = (obj: any) => {
  return typeof obj === 'object' && obj !== null;
};

export const isFunction = (fn: any) => {
  return typeof fn === 'function';
}

/**
 * oldObj: { a: { b: 1 }}
 * newObj: { a: { c: 2 }}
 * result: { a: { b: 1, c: 2 }}
 */
export const merge = (oldObj, newObj) => {
  if (!isObject(oldObj) || !isObject(newObj)) {
    if (isFunction(oldObj) && isFunction(newObj)) {
      return (...arg) => { oldObj(...arg); newObj(...arg); }
    }
    return newObj;
  }
  const result = { ...newObj, ...oldObj };
  Object.keys(oldObj).forEach(key => {
    if (newObj.hasOwnProperty(key)) {
      result[key] = merge(oldObj[key], newObj[key]);
    }
  });
  return result;
};

export const prepareProps = (oProps: any) => {
  const { className } = oProps;
  const props: any = Object.assign({}, oProps);
  delete props.className; // workaround for TS issue 'spread object of generic type'
  return { className, props };
};

/**
 * merge className with css
 * merge function with root function
 * merge objects with merge
 */
export const mergeProps = (...props) => {
  const result = props.reduce(merge);
  result.className = css`${props.map(prop => prop.className).join(' ')}`;
  return result;
}

/**
 * HOC: instead of taking a Cmp as argument, return a props object to spread, so user can use it in a flexier way
 */