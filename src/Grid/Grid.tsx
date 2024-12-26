import { ReactNode, useMemo, useState } from "react";
import { useGrid } from "../GridProvider";
import { useGridSize } from "../GridSizeProvider";
import { CellId } from "../GridProvider";
import { useSolve } from "./useSolve";
import { neverGuard } from "../neverGuard";

export const Grid = () => {
  const { letters, path } = useGrid();
  const { width, height } = useGridSize();

  const grid = useMemo(() => {
    const out: ReactNode[] = [];
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const key: CellId = `${x},${y}`;
        out.push(
          <button key={key} disabled={false}>
            {letters[key]}
          </button>
        );
      }
    }
    return out;
  }, [height, letters, width]);

  const { solve, state, solution } = useSolve();
  const [controller, setController] = useState<AbortController | undefined>();

  return (
    <div>
      <button
        onClick={() => {
          switch (state) {
            case "solving": {
              controller?.abort("cancelled");
              return;
            }
            case "solved": {
              return;
            }
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
        Solve
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
