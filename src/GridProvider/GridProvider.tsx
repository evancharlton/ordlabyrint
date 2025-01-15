import { ReactNode, useCallback, useMemo } from "react";
import { CellId, GridContext } from "./context";
import { useGridSize } from "../GridSizeProvider";
import { useBoardId } from "../BoardIdProvider";
import { useWords } from "../WordsProvider";
import { Letter } from "../trie";
import {
  hash,
  hashItem,
  PRNG,
  randomItem,
  useRandom,
} from "../spa-components/RandomProvider";
import { neverGuard } from "../spa-components/neverGuard";

const SIDES = ["top", "right", "bottom", "left"] as const;
type Side = (typeof SIDES)[number];

const MARCH: Record<Side, { dx: number; dy: number }> = {
  top: { dx: 0, dy: 1 },
  bottom: { dx: 0, dy: -1 },
  left: { dx: 1, dy: 0 },
  right: { dx: -1, dy: 0 },
};

type XY = { x: number; y: number };

const useGridLetters = (): Record<CellId, Letter> => {
  const { width, height } = useGridSize();
  const { id } = useBoardId();
  const { letters: LETTERS, words } = useWords();
  const { create } = useRandom();

  const getStart = useCallback(
    (random: PRNG): [Side, XY, (pos: XY) => number] => {
      const side = randomItem(SIDES, random);
      switch (side) {
        case "bottom": {
          return [
            side,
            { x: random(width), y: height - 1 },
            ({ y }) => y,
          ] as const;
        }
        case "top": {
          return [
            side,
            { x: random(width), y: 0 },
            ({ y }) => height - 1 - y,
          ] as const;
        }
        case "left": {
          return [
            side,
            { x: 0, y: random(height) },
            ({ x }) => width - 1 - x,
          ] as const;
        }
        case "right": {
          return [
            side,
            { x: width - 1, y: random(height) },
            ({ x }) => x,
          ] as const;
        }
        default: {
          return neverGuard(side, [
            side,
            { x: 0, y: 0 },
            () => Number.MAX_SAFE_INTEGER,
          ] as const);
        }
      }
    },
    [height, width],
  );

  const longWords = useMemo(
    () =>
      words.filter(
        (word) =>
          word.length > Math.min(width, height) &&
          word.length < Math.max(width, height) * 2,
      ),
    [height, width, words],
  );

  return useMemo(() => {
    const random = create(id);

    const grid: Record<CellId, Letter> = {};
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const key: CellId = `${x},${y}`;
        grid[key] = randomItem(LETTERS, random);
      }
    }

    // Insert a long word, just to guarantee that there's at least one
    // single-word solution.
    const path: XY[] = [];
    const hashedId = hash(id);
    const selectedWord = hashItem(longWords, hashedId);
    safetyLoop: while (true) {
      const [side, start, calc] = getStart(random);

      path.splice(0, path.length);
      path.push(start);

      let spanned = false;
      for (let i = 1; i < selectedWord.length; i += 1) {
        const lettersLeft = selectedWord.length - 1 - i;
        const current = path[path.length - 1];
        const { x, y } = current;
        if (!spanned) {
          const stepsToGoal = calc(current);
          if (lettersLeft === stepsToGoal - 1) {
            // We need to walk straight to the goal
            const { dx, dy } = MARCH[side];
            path.push({ x: x + dx, y: y + dy });
            continue;
          }
        }

        const neighbors = [
          { x: x + 1, y },
          { x: x - 1, y },
          { x, y: y + 1 },
          { x, y: y - 1 },
        ]
          .filter(({ x, y }) => {
            return x >= 0 && x < width && y >= 0 && y < height;
          })
          .filter(({ x, y }) => {
            return !path.find((xy) => xy.x === x && xy.y === y);
          });
        if (neighbors.length === 0) {
          // We boxed ourselves into a corner. Just start the whole damn thing
          // over again.
          continue safetyLoop;
        }

        const winner = randomItem(neighbors, random);
        path.push(winner);

        if (!spanned) {
          const distance = calc(winner);
          if (distance === 0) {
            spanned = true;
          }
        }
      }
      break safetyLoop;
    }

    path.forEach(({ x, y }, i) => {
      grid[`${x},${y}`] = selectedWord[i] as Letter;
    });

    return grid;
  }, [id, longWords, getStart, height, width, LETTERS, create]);
};

export const GridProvider = ({ children }: { children: ReactNode }) => {
  const letters = useGridLetters();

  return (
    <GridContext.Provider
      value={{
        letters,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};
