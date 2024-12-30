import { createContext, useContext } from "react";
import { CellId } from "../GridProvider";
import { Letters } from "../trie";

export const GameStateContext = createContext<
  | {
      addLetter: (id: CellId) => void;
      addWord: () => void;
      allowedIds: Record<CellId, true>;
      current: Letters;
      error: string | undefined;
      path: CellId[];
      removeLetter: (id: CellId) => void;
      reset: () => void;
      solved: boolean;
      words: string[];
    }
  | undefined
>(undefined);

export const useGamePlay = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error(
      "Must be rendered inside of <GameStateContext.Provider .. />!"
    );
  }
  return context;
};
