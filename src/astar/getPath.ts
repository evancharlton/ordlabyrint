import { CellId } from "../GridProvider";

export const getPath = <T = CellId>(
  cameFrom: Map<T, T>,
  current: T,
  length = Number.MAX_SAFE_INTEGER
) => {
  let n: T | undefined = current;
  const out: T[] = [];
  while (n) {
    out.unshift(n);
    n = cameFrom.get(n);
    if (out.length >= length) {
      break;
    }
  }
  return out;
};
