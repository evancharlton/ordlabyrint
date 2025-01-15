import { useCallback, useEffect, useRef, useState } from "react";
import { useWords } from "../WordsProvider";
import { useGridSize } from "../GridSizeProvider";
import { CellId, useGrid } from "../GridProvider";
import { Trie } from "../trie";
import { SolverState } from "./context";
import { Solution } from "../HistoryProvider";
import { useBoardId } from "../BoardIdProvider";
import { useStorageState } from "../useStorageState";

export const useSolve = () => {
  const { trie: root } = useWords();
  const { width, height } = useGridSize();
  const { letters } = useGrid();
  const [state, setState] = useState<SolverState>("pending");
  const [progress, setProgress] = useState<number>(0);
  const abortController = useRef<AbortController | null>(null);

  const { fingerprint } = useBoardId();
  const [solution, setSolution] = useStorageState<Solution>(
    `solutions/${fingerprint}`,
    {
      words: [],
      path: [],
      timestamp: 0,
    },
  );

  useEffect(() => {
    if (solution.words.length) {
      setState("solved");
    }
  }, [solution.words.length]);

  const abort = useCallback(() => {
    abortController.current?.abort();
  }, []);

  const solveBfs = useCallback(async () => {
    type Step = {
      x: number;
      y: number;
      node: Trie;
      current: string;
      path: CellId[];
      spanned: boolean;
    };

    type Input = Pick<Step, "x" | "y">;
    type GoalTester = (x: number, y: number) => boolean;

    type Exploration = [Input, GoalTester];

    const explorations: Exploration[] = [
      [{ x: 0, y: 0 }, (x, y) => x === width - 1 || y === height - 1],
      [{ x: 0, y: height - 1 }, (x, y) => x === width - 1 || y === 0],
      [{ x: width - 1, y: 0 }, (x, y) => x === 0 || y === height - 1],
      [{ x: width - 1, y: height - 1 }, (x, y) => x === 0 || y === 0],
    ];

    for (let y = 1; y <= height - 2; y += 1) {
      explorations.push(
        [{ x: 0, y }, (x) => x === width - 1],
        [{ x: width - 1, y }, (x) => x === 0],
      );
    }

    for (let x = 1; x <= width - 2; x += 1) {
      explorations.push(
        [{ x, y: 0 }, (_x, y) => y === height - 1],
        [{ x, y: height - 1 }, (_x, y) => y === 0],
      );
    }

    const bfs = async (
      input: Input,
      complete: GoalTester,
    ): Promise<Solution | undefined> => {
      const id: CellId = `${input.x},${input.y}`;
      const letter = letters[id]!;
      const initial: Step = {
        x: input.x,
        y: input.y,
        path: [id],
        node: root[letter]!,
        current: letter,
        spanned: false,
      };

      let i = 0;
      const queue: Step[] = [initial];
      while (queue.length) {
        if (i++ % 1000 === 0) {
          // yield processing time to keep the UI responsive
          setProgress(i);
          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        const { node, current, x, y, path, spanned } = queue.shift()!;

        if (node._) {
          if (spanned) {
            return {
              words: [current],
              timestamp: Date.now(),
              path,
            };
          }
        }

        [
          [x, y - 1],
          [x + 1, y],
          [x, y + 1],
          [x - 1, y],
        ]
          .reduce((acc, [x, y]) => {
            if (!(x >= 0 && x < width && y >= 0 && y < height)) {
              return acc;
            }

            const id: CellId = `${x},${y}`;
            // TODO: Maybe this becomes inefficient?
            if (path.includes(id)) {
              return acc;
            }

            const letter = letters[id];
            const next = node[letter];
            if (!next) {
              return acc;
            }

            const step: Step = {
              x,
              y,
              node: next,
              current: `${current}${letter}`,
              path: [...path, id],
              spanned: spanned || complete(x, y),
            };

            acc.push(step);

            return acc;
          }, [] as Step[])
          .forEach((n) => queue.push(n));
      }
    };

    const results = (
      await Promise.all(
        explorations.map(([input, complete]) => bfs(input, complete)),
      )
    ).filter((s): s is Solution => !!s);

    const [best] = results.sort(
      ({ words: a }, { words: b }) => a.join("").length - b.join("").length,
    );

    setSolution(best);
  }, [height, letters, root, setSolution, width]);

  return { abort, solve: solveBfs, state, progress, solution };
};
