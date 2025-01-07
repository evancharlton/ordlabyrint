import { Keyable } from "./types";

export const getPath = <T extends Keyable>(
  cameFrom: Map<string, T>,
  current: T,
  length = Number.MAX_SAFE_INTEGER,
) => {
  let n: T | undefined = current;
  const out: T[] = [];
  while (n) {
    out.unshift(n);
    n = cameFrom.get(n.key);
    if (out.length >= length) {
      break;
    }
  }
  return out;
};
