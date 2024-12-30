import { ReactNode, useMemo } from "react";
import { useGrid } from "../GridProvider";
import { useGridSize } from "../GridSizeProvider";
import { CellId } from "../GridProvider";
import classes from "./Grid.module.css";
import { useGamePlay } from "../GameStateProvider";
import { useSolution } from "../SolutionProvider";

const getPercents = (
  words: string[],
  path: CellId[]
): Record<CellId, number> => {
  const percents: Record<CellId, number> = {};
  let w = 0;
  let wordI = 0;
  for (let step = 0; step < (path.length ?? 0); step += 1) {
    const stepXY = path[step];

    const word = words[w];
    if (!word) {
      console.warn({ w, wordI, words, percents, step, stepXY });
      throw new Error("Walked out of the words");
    }

    percents[stepXY] = (wordI + 1) / word.length;
    wordI += 1;
    if (wordI === word.length) {
      w += 1;
      wordI = 0;
    }
  }

  return percents;
};

export const Grid = () => {
  const { letters } = useGrid();
  const { width, height } = useGridSize();
  const {
    addLetter,
    allowedIds,
    current,
    error,
    path,
    removeLetter,
    solved,
    words,
  } = useGamePlay();

  const { state, words: solutionWords, path: solutionPath } = useSolution();

  const solutionPercents = useMemo(
    () => getPercents(solutionWords, solutionPath),
    [solutionPath, solutionWords]
  );
  const pathPercents = useMemo(
    () => getPercents([...words, current as string], path),
    [current, path, words]
  );

  const grid: ReactNode[] = useMemo(() => {
    const grid: ReactNode[] = [];
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const key: CellId = `${x},${y}`;

        grid.push(
          <button
            key={key}
            disabled={
              solved ||
              state === "solved" ||
              state === "solving" ||
              state === "unsolvable" ||
              !allowedIds[key]
            }
            onClick={() => {
              if (path.includes(key)) {
                removeLetter(key);
              } else {
                addLetter(key);
              }
            }}
            className={[
              classes.letter,
              key in solutionPercents ? classes.solution : undefined,
              key in pathPercents ? classes.building : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              [`--intensity`]:
                solutionPercents[key] ?? pathPercents[key] ?? undefined,
            }}
          >
            {letters[key]}
          </button>
        );
      }
    }
    return grid;
  }, [
    addLetter,
    allowedIds,
    height,
    letters,
    path,
    pathPercents,
    removeLetter,
    solutionPercents,
    solved,
    state,
    width,
  ]);

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
        }}
      >
        {grid}
      </div>
      <pre style={{ textAlign: "left" }}>
        {JSON.stringify({ current, error, words, path, allowedIds }, null, 2)}
      </pre>
    </div>
  );
};
