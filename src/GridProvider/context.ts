import { createContext, useContext } from "react";
import { Letter } from "../trie";

export type CellId = `${number},${number}`;

export const GridContext = createContext<
  | {
      letters: Record<CellId, Letter>;
      path: CellId[];
      allowedIds: Record<CellId, true>;
      addStep: (id: CellId) => void;
    }
  | undefined
>(undefined);

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error("Must be rendered inside of <GridContext.Provider />!");
  }
  return context;
};
