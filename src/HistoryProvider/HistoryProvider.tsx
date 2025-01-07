import { ReactNode, useCallback } from "react";
import { Solution } from "./types";
import { HistoryContext } from "./context";
import { useStorageState } from "../useStorageState";
import { useParams } from "react-router";
import { useGridSize } from "../GridSizeProvider";
import { useBoardId } from "../BoardIdProvider";

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const { lang } = useParams();
  const { key: sizeKey } = useGridSize();
  const { id } = useBoardId();
  const key = `history/${lang}/${sizeKey}/${id}`;

  const [previousSolutions, setPreviousSolutions] = useStorageState<Solution[]>(
    key,
    [],
  );

  const add = useCallback(
    (solution: Solution) => {
      setPreviousSolutions((prev) => {
        // Does this solution exist already?
        const previous = prev.find(
          ({ path, words }) =>
            words.length === solution.words.length &&
            path.join("-") === solution.path.join("-"),
        );
        if (previous) {
          return prev;
        }
        return [...prev, solution];
      });
    },
    [setPreviousSolutions],
  );

  return (
    <HistoryContext.Provider value={{ previousSolutions, add }}>
      {children}
    </HistoryContext.Provider>
  );
};
