import { ReactNode, useCallback, useMemo, useState } from "react";
import { GridContext } from "./context";
import { useGridSize } from "../GridSizeProvider";
import { useBoardId } from "../BoardIdProvider";
import { LETTERS } from "../alphabet";
import { mulberry32 } from "../random";

const useRandomLetters = (): string[] => {
  const { width, height } = useGridSize();
  const { id } = useBoardId();

  return useMemo(() => {
    const random = mulberry32(id);
    const out = new Array(width * height);
    for (let i = 0; i < out.length; i += 1) {
      out[i] = LETTERS[Math.floor(random() * LETTERS.length)];
    }
    return out;
  }, [height, width, id]);
};

export const GridProvider = ({ children }: { children: ReactNode }) => {
  const { width, height } = useGridSize();
  const perimeter = useMemo(() => {
    const perimeter: Record<number, true> = {};
    const offset = height * (height - 1);
    for (let x = 0; x < width; x += 1) {
      perimeter[x] = true; // Top row
      perimeter[x + offset] = true; // Bottom row
    }

    for (let y = 0; y < height; y += 1) {
      perimeter[y * width] = true;
      perimeter[width - 1 + y * width] = true;
    }

    return perimeter;
  }, [height, width]);

  const [ids, setIds] = useState<number[]>([]);

  const letters = useRandomLetters();

  const allowedIds = useMemo<Record<number, true>>(() => {
    if (ids.length === 0) {
      return perimeter;
    }

    const last = ids[ids.length - 1];
    return [
      last - 1, // left
      last + 1, // right
      last - width, // top
      last + width, // bottom

      // TODO: Diagonals?
      last - 1 - width, // top-left
      last + 1 - width, // top-right
      last + 1 + width, // bottom-right
      last - 1 + width, // bottom-left
    ]
      .filter((n) => n >= 0 && n <= width * height)
      .filter((n) => {
        if (last % width > 0) {
          return true;
        }
        return (n % width) - 1 === last % width;
      })
      .reduce(
        (acc, id) => ({ ...acc, [id]: true }),
        ids.reduce((acc, id) => ({ ...acc, [id]: true }), {})
      );
  }, [height, ids, perimeter, width]);

  const addStep = useCallback(
    (id: number) => {
      setIds((v) => {
        if (v.length === 0) {
          return [id];
        }

        if (!allowedIds[id]) {
          console.warn("Nice try, hacker");
          return v;
        }

        const index = v.indexOf(id);
        if (index >= 0) {
          return v.slice(0, index + 1);
        }

        return [...v, id];
      });
    },
    [allowedIds]
  );

  return (
    <GridContext.Provider
      value={{
        letters,
        allowedIds,
        path: useMemo(() => ids.map((i) => letters[i]), [ids, letters]),
        addStep,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};
