import { Reducer } from "react";
import { CellId } from "../GridProvider";
import { neverGuard } from "../neverGuard";
import { Letter, Letters, Trie } from "../trie";
import { Direction } from "./types";

export type State = {
  path: CellId[];
  current: Letters;
  words: string[];
  error: string | undefined;
  revealed: boolean;
  solved: boolean;

  ends: Record<CellId, true>;
  node: Trie | undefined;
  root: Trie;
  grid: Record<CellId, Letter>;
  width: number;
  height: number;
};

type Update =
  | { action: "reset" }
  | { action: "set-revealed" }
  | { action: "set-solved" }
  | { action: "backspace" }
  | { action: "toggle-letter"; id: CellId }
  | { action: "toggle-direction"; direction: Direction }
  | { action: "add-word" };

const walk = (grid: State["grid"], root: State["root"], ids: CellId[]) => {
  let node: Trie | undefined = root;
  for (const id of ids) {
    const letter = grid[id];
    node = node?.[letter];
  }
  return node;
};

const DELTAS = {
  up: { dx: 0, dy: -1 },
  right: { dx: 1, dy: 0 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
} as const;

const checkSolved = (state: State): State => {
  const { ends, height, path, width, words } = state;
  if (words.length === 0) {
    return state;
  }

  if (path.length < width || path.length < height) {
    return state;
  }

  const opp = path.find((id) => !!ends[id]);
  if (!opp) {
    return state;
  }
  return reducer(state, { action: "set-solved" });
};

export const reducer: Reducer<State, Update> = (state, update): State => {
  const { action } = update;
  switch (action) {
    case "reset": {
      const { root } = state;
      return {
        ...state,
        path: [],
        current: "" as Letters,
        words: [],
        error: undefined,
        node: root,
        solved: false,
        ends: {},
      };
    }

    case "backspace": {
      const { path, root } = state;
      if (path.length === 0) {
        return state;
      }
      if (path.length === 1) {
        return {
          ...state,
          path: [],
          current: "" as Letters,
          words: [],
          error: undefined,
          node: root,
        };
      }
      return reducer(state, {
        action: "toggle-letter",
        id: path[path.length - 2],
      });
    }

    case "toggle-direction": {
      const { direction } = update;
      const { path } = state;
      if (path.length === 0) {
        return state;
      }

      const last = path[path.length - 1];
      const [x, y] = last.split(",").map((v) => +v);

      const { dx, dy } = DELTAS[direction];

      return reducer(state, {
        action: "toggle-letter",
        id: `${x + dx},${y + dy}`,
      });
    }

    case "toggle-letter": {
      const { id } = update;

      const {
        current: oldCurrent,
        grid,
        node,
        path,
        revealed,
        root,
        solved,
        words: oldWords,
        width,
        height,
      } = state;

      if (!grid[id]) {
        return state;
      }

      if (revealed || solved) {
        return state;
      }

      if (path.length === 0) {
        // Start the path!
        const letter = grid[id];

        const ends = (() => {
          const w = width - 1;
          const h = height - 1;

          if (id === "0,0") {
            return { [`${w},${h}`]: true };
          }

          if (id === `0,${w}`) {
            return { [`${h},0`]: true };
          }

          if (id === `${h},0`) {
            return { [`0,${w}`]: true };
          }

          if (id === `${w},${h}`) {
            return { [`0,0`]: true };
          }

          const [x, y] = id.split(",").map((v) => +v);
          if (x === 0) {
            // Left edge
            return new Array(h - 1)
              .fill(0)
              .reduce((acc, _, i) => ({ ...acc, [`${w},${i + 1}`]: true }), {});
          }

          if (x === w) {
            // Right edge
            return new Array(h - 1)
              .fill(0)
              .reduce((acc, _, i) => ({ ...acc, [`0,${i + 1}`]: true }), {});
          }

          if (y === 0) {
            // Top edge
            return new Array(w - 1)
              .fill(0)
              .reduce((acc, _, i) => ({ ...acc, [`${i + 1},${h}`]: true }), {});
          }

          if (y === h) {
            // Bottom edge
            return new Array(w - 1)
              .fill(0)
              .reduce((acc, _, i) => ({ ...acc, [`${i + 1},0`]: true }), {});
          }

          throw new Error("Impossible situation");
        })();

        return {
          ...state,
          path: [id],
          current: letter as Letters,
          node: root[letter],
          error: undefined,
          ends,
        };
      }

      const index = path.indexOf(id);
      if (index === -1) {
        const nextLetter = grid[id];
        return {
          ...state,
          path: [...path, id],
          current: (oldCurrent + nextLetter) as Letters,
          node: node?.[nextLetter],
          error: undefined,
        };
      }

      if (index === 0) {
        // Treat the zeroth one as a sort of reset
        return {
          ...state,
          path: [],
          current: "" as Letters,
          words: [],
          error: undefined,
          node: root,
          ends: {},
        };
      }

      // The user is switching off a previous node. We want to prune everything
      // after this (and the node itself).
      const newPath = path.slice(0, index + 1);

      const newWords = [];

      let wordIndex = 0;
      let current = "";
      let consumed = 0;

      while (consumed < newPath.length) {
        const word = oldWords[wordIndex++];
        const remaining = newPath.length - consumed;
        if (!word) {
          // We're out of words - most likely, the user is trimming before any
          // words have been added.
          current = (oldCurrent as string).substring(0, index + 1);
          break;
        }

        if (word.length > remaining) {
          // The latest word is the one being trimmed - slice it off and into
          // the current field.
          current = word.substring(0, remaining);
          break;
        }

        newWords.push(word);
        consumed += word.length;
      }

      return {
        ...state,
        path: newPath,
        current: current as Letters,
        node: walk(grid, root, newPath),
        error: undefined,
        words: newWords,
      };
    }

    case "add-word": {
      const { current, node, solved, revealed, root, words } = state;

      if (revealed || solved) {
        return state;
      }

      if (current.length < 3) {
        return {
          ...state,
          error: "For kort",
        };
      }

      if (import.meta.env.PROD && !node?._) {
        return {
          ...state,
          error: "Not a word",
        };
      }

      const next: State = {
        ...state,
        current: "" as Letters,
        words: [...words, current as string],
        node: root,
        error: undefined,
      };

      return checkSolved(next);
    }

    case "set-revealed": {
      return {
        ...state,
        revealed: true,
      };
    }

    case "set-solved": {
      return {
        ...state,
        solved: true,
      };
    }

    default: {
      return neverGuard(action, state);
    }
  }
};
