import { ReactNode, useCallback, useMemo, useReducer } from "react";
import { CellId, useGrid } from "../GridProvider";
import { GameStateContext } from "./context";
import { reducer, State } from "./state";
import { useGridSize } from "../GridSizeProvider";
import { useWords } from "../LanguageProvider";
import { Letters } from "../trie";

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const { letters } = useGrid();
  const { width, height } = useGridSize();
  const { trie } = useWords();
  const [{ path, current, words, error }, dispatch] = useReducer(reducer, {
    path: [],
    current: "" as Letters,
    words: [],
    error: undefined,
    node: trie,
    root: trie,
    grid: letters,
  } satisfies State);

  const allowedIds = useMemo((): Record<CellId, true> => {
    if (path.length === 0) {
      const perimeterIds: Record<CellId, true> = {};
      for (let x = 0; x < width; x += 1) {
        perimeterIds[`${x},${0}`] = true;
        perimeterIds[`${x},${height - 1}`] = true;
      }

      for (let y = 0; y < height - 1; y += 1) {
        perimeterIds[`${0},${y}`] = true;
        perimeterIds[`${width - 1},${y}`] = true;
      }
      Object.freeze(perimeterIds);
      return perimeterIds;
    }

    const id = path[path.length - 1];

    const [x, y] = id.split(",").map((v) => +v);
    return [
      [x, y - 1], // top
      [x + 1, y], // right
      [x, y + 1], // bottom
      [x - 1, y], // left
    ]
      .map(([x, y]): CellId => `${x},${y}`)
      .filter((id) => !!letters[id])
      .reduce(
        (acc, id) => ({ ...acc, [id]: true }),
        path.reduce<Record<CellId, true>>(
          (acc, id) => ({ ...acc, [id]: true }),
          {} as Record<CellId, true>
        )
      );
  }, [height, letters, path, width]);

  const addLetter = useCallback((id: CellId) => {
    dispatch({ action: "add-letter", id });
  }, []);

  const addWord = useCallback(() => {
    dispatch({ action: "add-word" });
  }, []);

  const removeLetter = useCallback((id: CellId) => {
    dispatch({ action: "remove-letter", id });
  }, []);

  const reset = useCallback(() => {
    dispatch({ action: "reset" });
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        addLetter,
        addWord,
        allowedIds,
        current,
        error,
        path,
        removeLetter,
        reset,
        words,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
