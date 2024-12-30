import { createContext, useContext } from "react";
import { CellId } from "../GridProvider";
import { Letters } from "../trie";

export const GameStateContext = createContext<
  | {
      addWord: () => void;
      allowedIds: Record<CellId, true>;
      current: Letters;
      error: string | undefined;
      path: CellId[];
      reset: () => void;
      solved: boolean;
      toggleLetter: (id: CellId) => void;
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
