export const getDisplayName = (WrappedComponent) => WrappedComponent.displayName || WrappedComponent.name || 'Component';

const _pipe = (a, b) => (...args) => b(a(...args));
export const pipe = (...ops) => ops.reduce(_pipe);