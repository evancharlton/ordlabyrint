import { createContext, useContext } from "react";

export const GridContext = createContext<
  | {
      letters: string[];
      path: string[];
      allowedIds: Record<number, true>;
      addStep: (id: number) => void;
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
