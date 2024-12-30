import { ReactNode, useMemo } from "react";
import { CellId, GridContext } from "./context";
import { useGridSize } from "../GridSizeProvider";
import { useBoardId } from "../BoardIdProvider";
import { mulberry32, randomItem } from "../random";
import { useWords } from "../LanguageProvider";
import { Letter } from "../trie";

const useGridLetters = (): Record<CellId, Letter> => {
  const { width, height } = useGridSize();
  const { id } = useBoardId();
  const { letters: LETTERS } = useWords();

  return useMemo(() => {
    const random = mulberry32(id);

    const grid: Record<CellId, Letter> = {};
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const key: CellId = `${x},${y}`;
        grid[key] = randomItem(LETTERS, random);
      }
    }

    return grid;
  }, [id, height, width, LETTERS]);
};

export const GridProvider = ({ children }: { children: ReactNode }) => {
  const letters = useGridLetters();

  return (
    <GridContext.Provider
      value={{
        letters,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};
