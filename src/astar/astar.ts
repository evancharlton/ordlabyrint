import { pq } from "./pq";
import { getPath } from "./getPath";
import { Keyable } from "./types";

type Args<T> = {
  neighbors: (node: T) => T[];
  weight: (neighbor: T, current: T, path: (limit: number) => T[]) => number;
  start: T;
  goal: (node: T) => boolean;
  h: (neighbor: T, current: T, path: (limit: number) => T[]) => number;
  continuing?: () => boolean;
  onProgress?: (steps: number) => undefined;
  signal?: AbortSignal;
};

export const astar = async <T extends Keyable>({
  neighbors: getNeighbors,
  weight,
  start,
  goal,
  h,
  onProgress = () => undefined,
  signal,
}: Args<T>) => {
  const queue = pq(start);
  const cameFrom = new Map<string, T>();

  const gScore = new Map<string, number>(); // ?? Number.MAX_SAFE_INTEGER
  const g = (node: T) => gScore.get(node.key) ?? Number.MAX_SAFE_INTEGER;
  gScore.set(start.key, 0);

  const fScore = new Map<string, number>(); // ?? Number.MAX_SAFE_INTEGER
  const f = (node: T) => fScore.get(node.key) ?? Number.MAX_SAFE_INTEGER;
  fScore.set(
    start.key,
    h(start, start, () => [])
  );

  let i = 0;

  while (queue.length() > 0 && !signal?.aborted) {
    const current = queue.take();
    if (!current) {
      break;
    }

    if (i++ % 1_000 === 0) {
      onProgress(queue.length());
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    if (goal(current)) {
      return [current, () => getPath(cameFrom, current)] as const;
    }

    const neighbors = getNeighbors(current);
    for (let i = 0; i < neighbors.length; i += 1) {
      const neighbor = neighbors[i];
      const tentativeScore =
        g(current) +
        weight(neighbor, current, (n) => getPath(cameFrom, current, n));
      if (tentativeScore < g(neighbor)) {
        cameFrom.set(neighbor.key, current);
        gScore.set(neighbor.key, tentativeScore);
        fScore.set(
          neighbor.key,
          tentativeScore +
            h(neighbor, current, (n) => getPath(cameFrom, current, n))
        );
        queue.put(neighbor, f(neighbor));
      }
    }
  }
  return [undefined, () => undefined] as const;
};
