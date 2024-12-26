export const neverGuard = <T>(_: never, def: T): T => {
  return def;
};
