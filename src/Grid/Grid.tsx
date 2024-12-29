import { ReactNode, useMemo, useState } from "react";
import { useGrid } from "../GridProvider";
import { useGridSize } from "../GridSizeProvider";
import { CellId } from "../GridProvider";
import { useSolve } from "./useSolve";
import { neverGuard } from "../neverGuard";
import classes from "./Grid.module.css";
import { Link, useParams } from "react-router";

export const Grid = () => {
  const { letters, path } = useGrid();
  const { width, height } = useGridSize();

  const { solve, state, solution } = useSolve();
  const [controller, setController] = useState<AbortController | undefined>();

  const grid = useMemo(() => {
    const out: ReactNode[] = [];
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const key: CellId = `${x},${y}`;

        const i = solution?.path.indexOf(key) ?? 0;
        const percent = (i + 1) / (solution?.path.length ?? 1);
        out.push(
          <button
            key={key}
            disabled={false}
            className={solution?.path?.includes(key) ? classes.used : undefined}
            style={{ [`--intensity`]: percent }}
          >
            {letters[key]}
          </button>
        );
      }
    }
    return out;
  }, [height, letters, solution?.path, width]);

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
      {state === "solved" ? <div>{solution?.words.join(" - ")}</div> : null}
      <div>{path.join(" - ")}</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
        }}
      >
        {grid}
      </div>
    </div>
  );
};
