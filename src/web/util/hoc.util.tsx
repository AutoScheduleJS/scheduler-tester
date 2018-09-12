import { cx } from 'emotion';

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
};

/**
 * oldObj: { a: { b: 1, e: 8 }}
 * newObj: { a: { c: 2, e: undefined }}
 * result: { a: { b: 1, c: 2, e: 8 }}
 */
export const merge = (oldObj, newObj) => {
  if (!isObject(oldObj) || !isObject(newObj)) {
    if (isFunction(oldObj) && isFunction(newObj)) {
      return (...arg) => {
        oldObj(...arg);
        newObj(...arg);
      };
    }
    return newObj === undefined ? oldObj : newObj;
  }
  const result = { ...newObj, ...oldObj };
  Object.keys(oldObj).forEach(key => {
    if (newObj.hasOwnProperty(key)) {
      result[key] = merge(oldObj[key], newObj[key]);
    }
  });
  return result;
};

export const mergeAll = (...objs) => {
  return objs.reduce((acc, cur) => merge(acc, cur));
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
  result.className = cx(
    ...props.filter(prop => prop && prop.className).map(prop => prop.className)
  );
  return result;
};

export interface IStateHandler {
  state: any;
  setState: (v: any) => any;
}

export const stateHandler = <T extends IStateHandler>(context: T, name: keyof T['state']) => {
  return {
    state: context.state[name],
    setState: v =>
      context.setState({
        [name]: v,
      }),
  };
};
