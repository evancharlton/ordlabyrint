import { pq } from "./pq";
import { getPath } from "./getPath";
import { CellId } from "../GridProvider";

type Args<T> = {
  neighbors: (cell: T, prefix: string) => T[];
  weight: (neighbor: T, current: T, path: (limit: number) => T[]) => number;
  start: T;
  goal: (cell: T) => boolean;
  h: (cell: T) => number;
  continuing?: () => boolean;
};

export const astar = <T = { word: string; id: CellId }>({
  neighbors: getNeighbors,
  weight,
  start,
  goal,
  h,
  continuing = () => true,
}: Args<T>) => {
  const queue = pq(start);
  const cameFrom = new Map<T, T>();

  const gScore = new Map<T, number>(); // ?? Number.MAX_SAFE_INTEGER
  const g = (key: T) => gScore.get(key) ?? Number.MAX_SAFE_INTEGER;
  gScore.set(start, 0);

  const fScore = new Map<T, number>(); // ?? Number.MAX_SAFE_INTEGER
  const f = (key: T) => fScore.get(key) ?? Number.MAX_SAFE_INTEGER;
  fScore.set(start, h(start));

  while (queue.length() > 0 && continuing()) {
    const current = queue.take();
    if (!current) {
      break;
    }

    if (goal(current)) {
      return getPath(cameFrom, current);
    }

    const neighbors = getNeighbors(current);
    for (let i = 0; i < neighbors.length; i += 1) {
      const neighbor = neighbors[i];
      const tentativeScore =
        g(current) +
        weight(neighbor, current, (n) => getPath(cameFrom, current, n));
      if (tentativeScore < g(neighbor)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeScore);
        fScore.set(neighbor, tentativeScore + h(neighbor));
        queue.put(neighbor, f(neighbor));
      }
    }
  }

  throw new Error(`No path found: astar(..)`);
};
