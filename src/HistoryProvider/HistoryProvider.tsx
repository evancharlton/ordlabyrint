import { ReactNode, useCallback, useState } from "react";
import { Solution } from "./types";
import { HistoryContext } from "./context";

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [previousSolutions, setPreviousSolutions] = useState<Solution[]>([]);

  const add = useCallback((solution: Solution) => {
    setPreviousSolutions((prev) => {
      // Does this solution exist already?
      const previous = prev.find(
        ({ path, words }) =>
          words.length === solution.words.length &&
          path.join("-") === solution.path.join("-")
      );
      if (previous) {
        return prev;
      }
      return [...prev, solution];
    });
  }, []);

  return (
    <HistoryContext.Provider value={{ previousSolutions, add }}>
      {children}
    </HistoryContext.Provider>
  );
};
