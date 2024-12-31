import { createContext, useContext } from "react";
import { CellId } from "../GridProvider";

export type SolverState =
  | "pending"
  | "solving"
  | "aborted"
  | "solved"
  | "unsolvable";

export const SolutionContext = createContext<
  | {
      path: CellId[];
      words: string[];

      /** A unitless number indicating progress has happened. */
      progress: number;

      state: SolverState;
      solve: () => void;
      abort: () => void;
    }
  | undefined
>(undefined);

export const useSolution = () => {
  const context = useContext(SolutionContext);
  if (!context) {
    throw new Error("Must be used within <SolutionProvider .. />!");
  }
  return context;
};
