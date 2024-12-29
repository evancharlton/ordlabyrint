import { ReactNode, useCallback, useMemo } from "react";
import { SolutionContext } from "./context";

export const SolutionProvider = ({ children }: { children: ReactNode }) => {
  // const { words: dictionary } = useWords();

  // const { width, height } = useGridSize();
  // const [best, setBest] = useState<CellId[]>([]);
  // const { letters } = useGrid();

  // const solve = useCallback(() => {
  //   const queue = (() => {
  //     const out: CellId[] = [];

  //     // left side
  //     for (let y = 1; y < height - 1; y += 1) {
  //       out.push(`0,${y}`);
  //     }

  //     return out;
  //   })();

  //   while (queue.length) {
  //     const current = queue.shift();
  //   }

  //   setBest([]);
  // }, [width, height]);

  return (
    <SolutionContext.Provider
      value={{
        ids: useMemo(() => [], []),
        words: useMemo(() => [], []),
        begin: useCallback(() => undefined, []),
      }}
    >
      {children}
    </SolutionContext.Provider>
  );
};
