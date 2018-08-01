export const getDisplayName = (name: string, ...cmps: Array<React.ComponentType<any>>) =>
  cmps.reduce((acc, cul) => acc + ' + ' + cul.displayName || cul.name || 'Component', name);

const _pipe = (a, b) => (...args) => b(a(...args));
export const pipe = (...ops) => ops.reduce(_pipe);

export const converge = <T extends any>(fn: (...args) => T, ...toArgs: Array<(a) => any>) => (val: any) => fn(...toArgs.map(toArg => toArg(val)));
