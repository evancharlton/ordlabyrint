import { ReactNode, useCallback, useMemo } from "react";
import { CellId, GridContext } from "./context";
import { useGridSize } from "../GridSizeProvider";
import { useBoardId } from "../BoardIdProvider";
import { LETTERS } from "../alphabet";
import { mulberry32, randomItem } from "../random";
import SolutionProvider from "../SolutionProvider";

const useGridLetters = (): Record<CellId, string> => {
  const { width, height } = useGridSize();
  const { id } = useBoardId();

  return useMemo(() => {
    const random = mulberry32(id);

    const grid: Record<CellId, string> = {};
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const key: CellId = `${x},${y}`;
        grid[key] = randomItem(LETTERS, random);
      }
    }

    return grid;
  }, [id, height, width]);
};

export const GridProvider = ({ children }: { children: ReactNode }) => {
  const letters = useGridLetters();

  const addStep = useCallback((id: CellId) => {
    console.log(id);
  }, []);

  return (
    <GridContext.Provider
      value={{
        letters,
        allowedIds: useMemo(() => ({}), []),
        path: useMemo(() => [], []),
        addStep,
      }}
    >
      <SolutionProvider>{children}</SolutionProvider>
    </GridContext.Provider>
  );
};
