import { createContext, useContext } from "react";
import { Solution } from "./types";

export const HistoryContext = createContext<
  | { previousSolutions: Solution[]; add: (solution: Solution) => void }
  | undefined
>(undefined);

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("Must be used within <HistoryContext .. />!");
  }
  return context;
};
