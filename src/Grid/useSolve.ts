import { useCallback } from "react";
import { useWords } from "../LanguageProvider";
import { useGridSize } from "../GridSizeProvider";
import { CellId, useGrid } from "../GridProvider";

type Step = {
  path: CellId[];
  words: string[];
  current: string;
  goal: (_: { x: number; y: number }) => boolean;
};

export const useSolve = () => {
  const { lookup, words: allWords } = useWords();
  const { width, height } = useGridSize();
  const { letters } = useGrid();

  return useCallback(() => {
    const queue: Step[] = [];

    for (let y = 1; y < height - 1; y += 1) {
      queue.push(
        {
          path: [`0,${y}`],
          words: [],
          current: letters[`0,${y}`],
          goal: ({ x, y }) => x === width - 1 && y !== 0 && y !== height - 1,
        },
        {
          path: [`${width - 1},${y}`],
          words: [],
          current: letters[`${width - 1},${y}`],
          goal: ({ x, y }) => x === 0 && y !== 0 && y !== height - 1,
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
        },
        {
          path: [`${x},${height - 1}`],
          words: [],
          current: letters[`${x},${height - 1}`],
          goal: ({ x, y }) => y === 0 && x !== 0 && x !== height - 1,
        }
      );
    }

    queue.push(
      {
        path: [`0,0`],
        words: [],
        current: letters[`0,0`],
        goal: ({ x, y }) => x === width - 1 && y === height - 1,
      },
      {
        path: [`${width - 1},0`],
        words: [],
        current: letters[`${width - 1},0`],
        goal: ({ x, y }) => x === 0 && y === height - 1,
      },
      {
        path: [`0,${height - 1}`],
        words: [],
        current: letters[`0,${height - 1}`],
        goal: ({ x, y }) => x === width - 1 && y === 0,
      },
      {
        path: [`${width - 1},${height - 1}`],
        words: [],
        current: letters[`${width - 1},${height - 1}`],
        goal: ({ x, y }) => x === 0 && y === 0,
      }
    );

    const solutions: Step[] = [];
    let sanity = 0;
    while (queue.length) {
      console.log(queue.length);
      if (sanity++ >= 10_0000) {
        console.warn(`Stopping after ${sanity} steps`);
        break;
      }
      const step = queue.shift()!;
      const { path, words, current, goal } = step;

      const id = path[path.length - 1]!;
      const [x, y] = id.split(",").map((v) => +v);

      const isComplete = lookup.has(current);

      if (isComplete && goal({ x, y })) {
        // We have made it across the grid *and* a valid word has been formed.
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

      // TODO: Swap this out with a trie
      const wordsSubset = allWords.filter((candidate) =>
        candidate.startsWith(current)
      );
      neighbors.forEach((key) => {
        const letter = letters[key];
        const potentialWord = current + letter;
        const matchingWord = wordsSubset.find((candidate) =>
          candidate.startsWith(potentialWord)
        );
        if (matchingWord) {
          queue.push({
            path: [...path, key],
            words,
            current: potentialWord,
            goal,
          });
        }
      });

      // If the current cell completes a word, then we need to consider what
      // would happen if we started a new word instead of extending.
      if (lookup.has(current)) {
        const reconstructed = [...words, current];
        neighbors.forEach((id) => {
          const letter = letters[id];
          queue.push({
            path: [...path, id],
            words: reconstructed,
            current: letter,
            goal,
          });
        });
      }
    }

    console.log(`Finished`);
    return solutions;
  }, [allWords, height, letters, lookup, width]);
};
