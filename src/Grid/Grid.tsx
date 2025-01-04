import { ReactNode, useEffect, useMemo, useRef } from "react";
import { useGrid } from "../GridProvider";
import { useGridSize } from "../GridSizeProvider";
import { CellId } from "../GridProvider";
import classes from "./Grid.module.css";
import { useGamePlay } from "../GameStateProvider";
import { useSolution } from "../SolutionProvider";
import { Direction } from "../GameStateProvider/types";

const getPercents = (
  words: string[],
  path: CellId[]
): Record<CellId, number> => {
  const percents: Record<CellId, number> = {};
  let w = 0;
  let wordI = 0;
  for (let step = 0; step < (path.length ?? 0); step += 1) {
    const stepXY = path[step];

    const word = words[w];
    if (!word) {
      console.warn({ w, wordI, words, percents, step, stepXY });
      throw new Error("Walked out of the words");
    }

    percents[stepXY] = (wordI + 1) / word.length;
    wordI += 1;
    if (wordI === word.length) {
      w += 1;
      wordI = 0;
    }
  }

  return percents;
};

const DEBUG = import.meta.env.DEV;

const DIRECTIONS: Record<
  "ArrowLeft" | "ArrowRight" | "ArrowDown" | "ArrowUp",
  Direction
> = {
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
} as const;

export const Grid = () => {
  const { letters } = useGrid();
  const { width, height } = useGridSize();
  const {
    addWord,
    allowedIds,
    backspace,
    clearError,
    current,
    ends,
    error,
    path,
    solved,
    toggleDirection,
    toggleLetter,
    words,
  } = useGamePlay();

  const last = path[path.length - 1];

  useEffect(() => {
    document.getElementById(`cell-${last}`)?.focus();
  }, [last]);

  const { state, words: solutionWords, path: solutionPath } = useSolution();

  const solutionPercents = useMemo(
    () => getPercents(solutionWords, solutionPath),
    [solutionPath, solutionWords]
  );
  const pathPercents = useMemo(
    () => getPercents([...words, current as string], path),
    [current, path, words]
  );

  const dragging = useRef<boolean>(false);
  const underTouch = useRef<CellId | undefined>(undefined);
  underTouch.current = last;

  const grid: ReactNode[] = useMemo(() => {
    const grid: ReactNode[] = [];
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const key: CellId = `${x},${y}`;

        grid.push(
          <button
            key={key}
            data-key={key}
            id={`cell-${key}`}
            disabled={
              solved ||
              state === "solved" ||
              state === "solving" ||
              state === "unsolvable" ||
              !allowedIds[key]
            }
            onClick={() => {
              toggleLetter(key);
            }}
            className={[
              classes.letter,
              key in solutionPercents ? classes.solution : undefined,
              key in pathPercents ? classes.building : undefined,
              key in ends ? classes.goal : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              [`--intensity`]:
                solutionPercents[key] ?? pathPercents[key] ?? undefined,
            }}
            onMouseDown={() => {
              dragging.current = true;
              toggleLetter(key);
            }}
            onMouseUp={() => {
              dragging.current = false;
            }}
            onMouseOver={() => {
              if (dragging.current) {
                toggleLetter(key);
              }
            }}
          >
            {letters[key]}
          </button>
        );
      }
    }
    return grid;
  }, [
    allowedIds,
    ends,
    height,
    letters,
    pathPercents,
    solutionPercents,
    solved,
    state,
    toggleLetter,
    width,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          addWord();
          break;

        case "ArrowUp":
        case "ArrowDown":
        case "ArrowRight":
        case "ArrowLeft":
          toggleDirection(DIRECTIONS[event.key]);
          break;

        case "Delete":
        case "Backspace": {
          backspace();
          break;
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [addWord, backspace, toggleDirection]);

  const gridRef = useRef<HTMLDivElement>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(0);
  useEffect(() => {
    const oldTimer = timeoutRef.current;
    if (oldTimer) {
      clearTimeout(oldTimer);
    }

    if (!error) {
      return;
    }

    const newTimer = setTimeout(() => {
      clearError();
    }, 2000);
    timeoutRef.current = newTimer;
    return () => {
      clearTimeout(newTimer);
    };
  }, [clearError, error]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      // Don't even attempt to handle multi-touch .. but also, we don't
      // want to break pinch-to-zoom stuff.
      if (e.touches.length !== 1) {
        return;
      }

      const touch = e.touches[0];
      if (!touch) {
        return;
      }

      e.preventDefault();

      const under = document.elementFromPoint(touch.pageX, touch.pageY);
      if (!under) {
        return;
      }

      if (under.hasAttribute("disabled")) {
        if (DEBUG) console.log("Ignoring disabled option");
        return;
      }

      const key = under.getAttribute("data-key") as CellId | undefined;
      if (!key) {
        return;
      }

      underTouch.current = key;
      toggleLetter(key);
    };

    const onTouchMove = (e: TouchEvent) => {
      // Don't even attempt to handle multi-touch .. but also, we don't
      // want to break pinch-to-zoom stuff.
      if (e.touches.length !== 1) {
        return;
      }

      const touch = e.touches[0];
      if (!touch) {
        if (DEBUG) console.log(`No touch event`);
        return;
      }

      const previous = underTouch.current;
      if (!previous) {
        if (DEBUG) console.log(`No previous cell`);
        return;
      }

      e.preventDefault();

      const under = document.elementFromPoint(touch.pageX, touch.pageY);
      if (!under) {
        if (DEBUG) console.log(`No element under touch`);
        return;
      }

      if (under.hasAttribute("disabled")) {
        if (DEBUG) console.log("Ignoring disabled option");
        return;
      }

      const key = under.getAttribute("data-key") as CellId | undefined;
      if (!key) {
        if (DEBUG) console.log(`Element doesn't have a key`);
        return;
      }

      if (previous === key) {
        if (DEBUG) console.log(`Ignoring no-op for ${key}`);
        return;
      }

      if (DEBUG) console.log(`Toggling ${key}`);
      toggleLetter(key);
      underTouch.current = key;
    };

    const ref = gridRef.current;
    ref?.addEventListener("touchstart", onTouchStart, { passive: false });
    ref?.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      ref?.removeEventListener("touchstart", onTouchStart);
      ref?.removeEventListener("touchmove", onTouchMove);
    };
  }, [toggleLetter]);

  return (
    <div className={classes.container}>
      <div
        ref={gridRef}
        className={classes.grid}
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
        }}
        onMouseLeave={() => {
          dragging.current = false;
        }}
        onTouchEnd={(e) => {
          // Don't even attempt to handle multi-touch .. but also, we don't
          // want to break pinch-to-zoom stuff.
          if (e.touches.length !== 1) {
            return;
          }

          dragging.current = false;
          underTouch.current = undefined;
        }}
      >
        {grid}
      </div>
      {solved ? <div className={classes.solved}>🎉</div> : null}
      {error ? (
        <div onClick={() => clearError()} className={classes.message}>
          {error}
        </div>
      ) : null}
    </div>
  );
};
