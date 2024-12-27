import { useCallback, useState } from "react";
import { useWords } from "../LanguageProvider";
import { useGridSize } from "../GridSizeProvider";
import { CellId, useGrid } from "../GridProvider";
import { Trie } from "../trie";
import { astar, type Keyable } from "../astar";

type Solution = {
  words: string[];
  path: CellId[];
};

type Step = Keyable & {
  x: number;
  y: number;

  minX: number;
  minY: number;
  maxX: number;
  maxY: number;

  goalX: number;
  goalY: number;

  path: CellId[];
  words: string[];
  current: string;
  node: Trie;
};

export const useSolve2 = () => {
  const { trie: root } = useWords();
  const { width, height } = useGridSize();
  const { letters } = useGrid();
  const [state, setState] = useState<
    "pending" | "solving" | "aborted" | "solved" | "unsolvable"
  >("pending");
  const [progress, setProgress] = useState<number>(0);
  const [solution, setSolution] = useState<Solution | undefined>();

  const solve = useCallback(
    async (signal: AbortSignal) => {
      setState("solving");

      const [final] = await astar<Step>({
        signal,
        onProgress: (v) => {
          setProgress(v);
        },
        neighbors: (cell) => {
          const { x, y, key, node } = cell;
          switch (key) {
            case "root": {
              const corner = (x: number, y: number): Step => {
                const key: CellId = `${x},${y}`;
                return {
                  key,
                  x: x,
                  y: y,
                  minX: x,
                  minY: y,
                  maxX: x,
                  maxY: y,
                  // TODO: I'm sure there's some math I can do to derive this
                  //       but my brain isn't that clever at the moment.
                  goalX: x === 0 ? width - 1 : 0,
                  goalY: y === 0 ? height - 1 : 0,
                  path: [key],
                  node: root[letters[key]]!,
                  words: [],
                  current: letters[key],
                };
              };

              const starts: Step[] = [
                // Top-left corner
                corner(0, 0),

                // Top-right corner
                corner(width - 1, 0),

                // Bottom-right corner
                corner(width - 1, height - 1),

                // Bottom-left corner
                corner(0, height - 1),
              ];

              for (let y = 1; y < height - 1; y += 1) {
                for (const x of [0, width - 1]) {
                  const key: CellId = `${x},${y}`;
                  starts.push({
                    key,
                    x,
                    y,
                    minX: x,
                    maxX: x,
                    minY: y,
                    maxY: y,

                    goalX: x === 0 ? width - 1 : 0,
                    goalY: -1,
                    path: [key],
                    words: [],
                    current: letters[key]!,
                    node: root[letters[key]]!,
                  });
                }
              }

              for (let x = 1; x < width - 1; x += 1) {
                for (const y of [0, height - 1]) {
                  const key: CellId = `${x},${y}`;
                  starts.push({
                    key,
                    x,
                    y,
                    minX: x,
                    maxX: x,
                    minY: y,
                    maxY: y,

                    goalX: -1,
                    goalY: y === 0 ? height - 1 : 0,
                    path: [key],
                    words: [],
                    current: letters[key]!,
                    node: root[letters[key]]!,
                  });
                }
              }

              return starts;
            }

            default: {
              return [
                [x, y - 1], // top
                [x + 1, y], // right
                [x, y + 1], // bottom
                [x - 1, y], // left

                // TODO: Allow for diagonals?
              ]
                .map(([x, y]) => {
                  const key: CellId = `${x},${y}`;
                  return { x, y, key, letter: letters[key] } as const;
                })
                .filter(({ letter }) => !!letter)
                .filter(({ key }) => !cell.path.includes(key))
                .map(({ x, y, key, letter }): Step[] => {
                  return (
                    [
                      // The possibility of starting a new word
                      node._ && {
                        x,
                        y,
                        key: `${cell.key} > ${key}`,

                        node: root[letter]!,
                        words: [...cell.words, cell.current],
                        current: letter,

                        maxX: Math.max(cell.maxX, x),
                        maxY: Math.max(cell.maxY, y),
                        minX: Math.min(cell.minX, x),
                        minY: Math.min(cell.minY, y),

                        goalX: cell.goalX,
                        goalY: cell.goalY,
                        path: [...cell.path, key],
                      },
                      // Continuing the current word -- if possible
                      cell.node[letter] && {
                        x,
                        y,
                        key: `${cell.key} + ${key}`,

                        node: cell.node[letter],
                        words: [...cell.words],
                        current: cell.current + letter,

                        maxX: Math.max(cell.maxX, x),
                        maxY: Math.max(cell.maxY, y),
                        minX: Math.min(cell.minX, x),
                        minY: Math.min(cell.minY, y),

                        goalX: cell.goalX,
                        goalY: cell.goalY,
                        path: [...cell.path, key],
                      },
                    ] satisfies (Step | undefined)[]
                  ).filter((v): v is Step => !!v);
                })
                .flat();
            }
          }
        },
        weight: (neighbor, current) => {
          if (neighbor.current.length < current.current.length) {
            // A new word was started. This is much more costly than using
            // one word.
            return 10;
          }
          return 1;
        },
        start: {
          key: "root",
          x: -1,
          y: -1,
          minX: -1,
          minY: -1,
          maxX: -1,
          maxY: -1,
          goalX: -1,
          goalY: -1,
          path: [],
          words: [],
          current: "",
          node: {},
        },
        goal: (current) => {
          if (!current.node._) {
            return false;
          }

          if (current.goalX >= 0) {
            if (
              current.maxX !== current.goalX &&
              current.minX !== current.goalX
            ) {
              return false;
            }
          }

          if (current.goalY >= 0) {
            if (
              current.maxY !== current.goalY &&
              current.minY !== current.goalY
            ) {
              return false;
            }
          }

          // We made a word and we spanned the grid -- I guess that means we're
          // done?
          return true;
        },
        h: (neighbor, current) => {
          if (neighbor.current.length < current.current.length) {
            // A new word was started. This is much more costly than using
            // one word.
            return 10;
          }
          return 1;
        },
      });
      if (final) {
        const solution: Solution = {
          words: [...final.words, final.current],
          path: final.path,
        };
        setSolution(solution);
        setState("solved");
      } else {
        setSolution(undefined);
        setState("unsolvable");
      }
    },
    [height, letters, root, width]
  );
  return { solve, state, progress, solution };
};
