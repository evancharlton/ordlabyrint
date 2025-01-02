import { ReactNode, useEffect, useMemo } from "react";
import { useGrid } from "../GridProvider";
import { useGridSize } from "../GridSizeProvider";
import { CellId } from "../GridProvider";
import classes from "./Grid.module.css";
import { useGamePlay } from "../GameStateProvider";
import { useSolution } from "../SolutionProvider";
import { Direction } from "../GameStateProvider/types";

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

const DIRECTIONS: Record<
  "ArrowLeft" | "ArrowRight" | "ArrowDown" | "ArrowUp",
  Direction
> = {
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
} as const;

export const Grid = () => {
  const { letters } = useGrid();
  const { width, height } = useGridSize();
  const {
    addWord,
    allowedIds,
    backspace,
    current,
    ends,
    path,
    solved,
    toggleDirection,
    toggleLetter,
    words,
  } = useGamePlay();

  const last = path[path.length - 1];

  useEffect(() => {
    document.getElementById(`cell-${last}`)?.focus();
  }, [last]);

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
            id={`cell-${key}`}
            disabled={
              solved ||
              state === "solved" ||
              state === "solving" ||
              state === "unsolvable" ||
              !allowedIds[key]
            }
            onClick={() => {
              toggleLetter(key);
            }}
            className={[
              classes.letter,
              key in solutionPercents ? classes.solution : undefined,
              key in pathPercents ? classes.building : undefined,
              key in ends ? classes.goal : undefined,
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
    allowedIds,
    ends,
    height,
    letters,
    pathPercents,
    solutionPercents,
    solved,
    state,
    toggleLetter,
    width,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          addWord();
          break;

        case "ArrowUp":
        case "ArrowDown":
        case "ArrowRight":
        case "ArrowLeft":
          toggleDirection(DIRECTIONS[event.key]);
          break;

        case "Delete":
        case "Backspace": {
          backspace();
          break;
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [addWord, backspace, toggleDirection]);

  return (
    <div className={classes.container}>
      <div
        className={classes.grid}
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
        }}
      >
        {grid}
      </div>
      {solved ? <div className={classes.solved}>🎉</div> : null}
    </div>
  );
};
