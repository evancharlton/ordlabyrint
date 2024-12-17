import BoardIdProvider from "../BoardIdProvider";
import GridProvider from "../GridProvider";
import { useGrid } from "../GridProvider";
import { useGridSize } from "../GridSizeProvider";

const Grid = () => {
  const { letters, addStep, path, allowedIds } = useGrid();
  const { width, height } = useGridSize();

  return (
    <div>
      <div>{path.join(" - ")}</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
        }}
      >
        {letters.map((letter, i) => (
          <button
            key={`${letter}-${i}`}
            disabled={!allowedIds[i]}
            onClick={() => addStep(i)}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export const Play = () => {
  return (
    <BoardIdProvider>
      <GridProvider>
        <Grid />
      </GridProvider>
    </BoardIdProvider>
  );
};
