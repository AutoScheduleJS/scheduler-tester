export const parseValue = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (_) {
    return undefined;
  }
};