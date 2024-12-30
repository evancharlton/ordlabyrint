import { Reducer } from "react";
import { CellId } from "../GridProvider";
import { neverGuard } from "../neverGuard";
import { Letter, Letters, Trie } from "../trie";

export type State = {
  path: CellId[];
  current: Letters;
  words: string[];
  error: string | undefined;
  revealed: boolean;
  solved: boolean;

  node: Trie | undefined;
  root: Trie;
  grid: Record<CellId, Letter>;
};

type Update =
  | { action: "reset" }
  | { action: "set-revealed" }
  | { action: "set-solved" }
  | { action: "toggle-letter"; id: CellId }
  | { action: "add-word" };

const walk = (grid: State["grid"], root: State["root"], ids: CellId[]) => {
  let node: Trie | undefined = root;
  for (const id of ids) {
    const letter = grid[id];
    node = node?.[letter];
  }
  return node;
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
      };
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
      } = state;

      if (revealed || solved) {
        return state;
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
        };
      }

      // The user is toggling a previous node. We want to prune everything
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

      return {
        ...state,
        current: "" as Letters,
        words: [...words, current as string],
        node: root,
        error: undefined,
      };
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
