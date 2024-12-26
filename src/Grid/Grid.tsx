import { ReactNode, useMemo } from "react";
import { useGrid } from "../GridProvider";
import { useGridSize } from "../GridSizeProvider";
import { CellId } from "../GridProvider";
import { useSolve } from "./useSolve";

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

  const solve = useSolve();

  return (
    <div>
      <button
        onClick={() => {
          const results = solve();
          console.log(results);
        }}
      >
        Solve
      </button>
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
