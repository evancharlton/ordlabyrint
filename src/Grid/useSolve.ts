import { useCallback, useState } from "react";
import { useWords } from "../LanguageProvider";
import { useGridSize } from "../GridSizeProvider";
import { CellId, useGrid } from "../GridProvider";
import { Trie } from "../trie";

type Step = {
  path: CellId[];
  words: string[];
  current: string;
  goal: (_: { x: number; y: number }) => boolean;
  completed: boolean;
  node: Trie;
};

type Solution = {
  words: string[];
  path: CellId[];
};

const compare = (a: Step, b: Step): number => {
  if (a.words.length !== b.words.length) {
    return a.words.length - b.words.length;
  }

  return a.path.length - b.path.length;
};

export const useSolve = () => {
  const { trie: root } = useWords();
  const { width, height } = useGridSize();
  const { letters } = useGrid();
  const [state, setState] = useState<
    "pending" | "solving" | "aborted" | "solved"
  >("pending");
  const [progress, _setProgress] = useState<number>(0);
  const [solution, setSolution] = useState<Solution | undefined>();

  const solve = useCallback(
    async (signal: AbortSignal) => {
      const queue: Step[] = [];

      for (let y = 1; y < height - 1; y += 1) {
        queue.push(
          {
            path: [`0,${y}`],
            words: [],
            current: letters[`0,${y}`],
            goal: ({ x, y }) => x === width - 1 && y !== 0 && y !== height - 1,
            node: root[letters[`0,${y}`]]!,
            completed: false,
          },
          {
            path: [`${width - 1},${y}`],
            words: [],
            current: letters[`${width - 1},${y}`],
            goal: ({ x, y }) => x === 0 && y !== 0 && y !== height - 1,
            node: root[letters[`${width - 1},${y}`]]!,
            completed: false,
          }
        );
      }

      for (let x = 1; x < width - 1; x += 1) {
        queue.push(
          {
            path: [`${x},0`],
            words: [],
            current: letters[`${x},0`],
            goal: ({ x, y }) => y === height - 1 && x !== 0 && x !== height - 1,
            node: root[letters[`${x},0`]]!,
            completed: false,
          },
          {
            path: [`${x},${height - 1}`],
            words: [],
            current: letters[`${x},${height - 1}`],
            goal: ({ x, y }) => y === 0 && x !== 0 && x !== height - 1,
            node: root[letters[`${x},${height - 1}`]]!,
            completed: false,
          }
        );
      }

      queue.push(
        {
          path: [`0,0`],
          words: [],
          current: letters[`0,0`],
          goal: ({ x, y }) => x === width - 1 && y === height - 1,
          node: root[letters[`0,0`]]!,
          completed: false,
        },
        {
          path: [`${width - 1},0`],
          words: [],
          current: letters[`${width - 1},0`],
          goal: ({ x, y }) => x === 0 && y === height - 1,
          node: root[letters[`${width - 1},0`]]!,
          completed: false,
        },
        {
          path: [`0,${height - 1}`],
          words: [],
          current: letters[`0,${height - 1}`],
          goal: ({ x, y }) => x === width - 1 && y === 0,
          node: root[letters[`0,${height - 1}`]]!,
          completed: false,
        },
        {
          path: [`${width - 1},${height - 1}`],
          words: [],
          current: letters[`${width - 1},${height - 1}`],
          goal: ({ x, y }) => x === 0 && y === 0,
          node: root[letters[`${width - 1},${height - 1}`]]!,
          completed: false,
        }
      );

      const solutions: Step[] = [];
      let i = 0;
      while (queue.length) {
        if (signal.aborted) {
          setState("aborted");
          break;
        }

        if (i++ % 1000 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        const step = queue.shift()!;
        const { path, words, current, goal, node } = step;

        const id = path[path.length - 1]!;
        const [x, y] = id.split(",").map((v) => +v);

        const wordCompleted = node._;
        const completed = step.completed || goal({ x, y });

        if (wordCompleted && completed) {
          // We have made it across the grid *and* a valid word has been formed.
          if (!solutions.length) {
            solutions.push(step);
            continue;
          }

          const best = solutions[0];
          const comparison = compare(step, best);
          if (comparison > 0) {
            // This means that "best" is a shorter (ie, better)
            // solution, and should be preferred
            break;
          }

          solutions.push(step);
          continue;
        }

        const neighbors: CellId[] = [
          [x - 1, y], // left
          [x, y - 1], // top
          [x + 1, y], // right
          [x, y + 1], // bottom
        ]
          .map((xy) => xy.join(",") as CellId)
          .filter((key) => !!letters[key])
          .filter((key) => !path.includes(key));

        neighbors.forEach((key) => {
          const letter = letters[key];
          const next = node[letter];
          if (next) {
            queue.push({
              path: [...path, key],
              words,
              current: current + letter,
              goal,
              node: next,
              completed: false,
            });
          }
        });

        // If the current cell completes a word, then we need to consider what
        // would happen if we started a new word instead of extending.
        if (wordCompleted) {
          const reconstructed = [...words, current];
          neighbors.forEach((id) => {
            const letter = letters[id];
            const restart = root[letter]!;
            queue.push({
              path: [...path, id],
              words: reconstructed,
              current: letter,
              goal,
              node: restart,
              completed: false,
            });
          });
        }
      }

      const random = solutions[Math.floor(Math.random() * solutions.length)];
      setSolution({
        words: [...random.words, random.current],
        path: random.path,
      });
      setState("solved");
    },
    [height, letters, root, width]
  );
  return { solve, state, progress, solution };
};
