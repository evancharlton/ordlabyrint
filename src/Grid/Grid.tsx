import { ReactNode, useMemo, useState } from "react";
import { useGrid } from "../GridProvider";
import { useGridSize } from "../GridSizeProvider";
import { CellId } from "../GridProvider";
import { useSolve } from "./useSolve";
import { neverGuard } from "../neverGuard";
import classes from "./Grid.module.css";
import { Link, useParams } from "react-router";
import { useGamePlay } from "../GameStateProvider";

const getPercents = (
  words: string[],
  path: CellId[]
): Record<CellId, number> => {
  const percents: Record<CellId, number> = {};
  const wordsArray = [...(words ?? [])];
  let word = wordsArray.shift();
  let wordI = 0;
  for (let step = 0; step < (path.length ?? 0); step += 1) {
    if (!word) {
      throw new Error("Walked out of words");
    }

    const stepXY = path[step];
    percents[stepXY] = (wordI + 1) / word.length;
    wordI += 1;
    if (wordI === word.length) {
      word = wordsArray.shift();
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
    addWord,
    allowedIds,
    current,
    error,
    path,
    removeLetter,
    reset,
    words,
  } = useGamePlay();

  const { solve, state, solution } = useSolve();
  const [controller, setController] = useState<AbortController | undefined>();

  const grid = useMemo(() => {
    const solutionPercents = getPercents(
      [...(solution?.words ?? [])],
      solution?.path ?? []
    );

    const pathPercents = getPercents([...words, current as string], path);

    const out: ReactNode[] = [];
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const key: CellId = `${x},${y}`;

        out.push(
          <button
            key={key}
            disabled={!allowedIds[key]}
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
    return out;
  }, [
    addLetter,
    allowedIds,
    current,
    height,
    letters,
    path,
    removeLetter,
    solution?.path,
    solution?.words,
    width,
    words,
  ]);

  const { lang, size } = useParams();

  return (
    <div>
      <Link to={`/${lang}/${size}/${Date.now()}`}>New</Link>
      <button
        onClick={() => {
          switch (state) {
            case "solving": {
              controller?.abort("cancelled");
              return;
            }
            case "unsolvable":
            case "solved":
            case "pending":
            case "aborted": {
              const c = new AbortController();
              setController(c);
              solve(c.signal);
              return;
            }
            default: {
              return neverGuard(state, undefined);
            }
          }
        }}
      >
        {state}
      </button>
      <button onClick={() => addWord()}>Word</button>
      <button onClick={() => reset()}>Reset</button>
      {state === "solved" ? <div>{solution?.words.join(" - ")}</div> : null}
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
