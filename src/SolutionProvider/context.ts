import { createContext, useContext } from "react";

export const SolutionContext = createContext<
  { ids: number[]; words: string[]; begin: () => void } | undefined
>(undefined);

export const useSolution = () => {
  const context = useContext(SolutionContext);
  if (!context) {
    throw new Error("Must be used within <SolutionProvider .. />!");
  }
  return context;
};
