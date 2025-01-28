import { ReactNode, useCallback } from "react";
import { Solution } from "./types";
import { HistoryContext } from "./context";
import { useStorageState } from "../StorageContainer";
import { useParams } from "react-router";
import { useGridSize } from "../GridSizeProvider";
import { useBoardId } from "../BoardIdProvider";

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const { lang } = useParams();
  const { key: sizeKey } = useGridSize();
  const { id } = useBoardId();

  const [previousSolutions, setPreviousSolutions] = useStorageState<
    Record<string, Solution[]>
  >(`${lang}/${sizeKey}/history`, {});

  const add = useCallback(
    (solution: Solution) => {
      setPreviousSolutions((value) => {
        // Does this solution exist already?
        const previous = value?.prev?.find(
          ({ path, words }) =>
            words.length === solution.words.length &&
            path.join("-") === solution.path.join("-"),
        );
        if (previous) {
          return value;
        }
        return {
          ...value,
          [id]: [...(value.id ?? []), solution],
        };
      });
    },
    [id, setPreviousSolutions],
  );

  return (
    <HistoryContext.Provider
      value={{ previousSolutions: previousSolutions[id] ?? [], add }}
    >
      {children}
    </HistoryContext.Provider>
  );
};
