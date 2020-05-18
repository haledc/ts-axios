export function spread<T, R>(callback: (...args: T[]) => R) {
  return function wrap(arr: T[]) {
    return callback.apply(null, arr);
  };
}
