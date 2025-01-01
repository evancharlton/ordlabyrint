import { ReactNode, useCallback, useEffect, useMemo, useReducer } from "react";
import { CellId, useGrid } from "../GridProvider";
import { GameStateContext } from "./context";
import { reducer, State } from "./state";
import { useGridSize } from "../GridSizeProvider";
import { useWords } from "../LanguageProvider";
import { Letters } from "../trie";
import { useSolution } from "../SolutionProvider";
import { useHistory } from "../HistoryProvider";
import { Direction } from "./types";

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  const { letters } = useGrid();
  const { width, height } = useGridSize();
  const { trie } = useWords();
  const [{ path, current, words, error, solved }, dispatch] = useReducer(
    reducer,
    {
      path: [],
      current: "" as Letters,
      words: [],
      error: undefined,
      node: trie,
      root: trie,
      grid: letters,
      revealed: false,
      solved: false,
      width,
      height,
    } satisfies State
  );

  const { state } = useSolution();
  useEffect(() => {
    if (state === "solved") {
      dispatch({ action: "set-revealed" });
    }
  }, [state]);

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

  const toggleLetter = useCallback((id: CellId) => {
    dispatch({ action: "toggle-letter", id });
  }, []);

  const toggleDirection = useCallback((direction: Direction) => {
    dispatch({ action: "toggle-direction", direction });
  }, []);

  const addWord = useCallback(() => {
    dispatch({ action: "add-word" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ action: "reset" });
  }, []);

  const backspace = useCallback(() => {
    dispatch({ action: "backspace" });
  }, []);

  const { add } = useHistory();
  useEffect(() => {
    if (solved) {
      add({
        words,
        path,
        timestamp: Date.now(),
      });
    }
  }, [add, path, solved, words]);

  return (
    <GameStateContext.Provider
      value={{
        addWord,
        allowedIds,
        backspace,
        current,
        error,
        path,
        reset,
        solved,
        toggleDirection,
        toggleLetter,
        words,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
