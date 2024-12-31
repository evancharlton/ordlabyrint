import { ReactNode } from "react";
import { SolutionContext } from "./context";
import { useSolve } from "./useSolve";

export const SolutionProvider = ({ children }: { children: ReactNode }) => {
  const { abort, progress, state, solve, solution } = useSolve();

  return (
    <SolutionContext.Provider
      value={{
        abort,
        progress,
        solve,
        state,
        path: solution?.path ?? [],
        words: solution?.words ?? [],
      }}
    >
      {children}
    </SolutionContext.Provider>
  );
};
