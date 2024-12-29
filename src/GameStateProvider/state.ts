import { Reducer } from "react";
import { CellId } from "../GridProvider";
import { neverGuard } from "../neverGuard";
import { Letter, Letters, Trie } from "../trie";

export type State = {
  path: CellId[];
  current: Letters;
  words: string[];
  error: string | undefined;

  node: Trie | undefined;
  root: Trie;
  grid: Record<CellId, Letter>;
};

type Update =
  | { action: "reset" }
  | { action: "remove-letter"; id: CellId }
  | { action: "add-letter"; id: CellId }
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
      return {
        ...state,
        path: [],
        current: "" as Letters,
        words: [],
        error: undefined,
        node: state.root,
      };
    }

    case "remove-letter": {
      const { id } = update;
      const { grid, path, root, words } = state;
      const index = path.indexOf(id);
      if (index === -1) {
        return {
          ...state,
          error: "Trying to remove a letter not on the path",
        };
      }

      if (index === 0) {
        // Treat the zeroth one as a reset
        return {
          ...state,
          path: [],
          current: "" as Letters,
          words: [],
          error: undefined,
          node: state.root,
        };
      }

      // The user is toggling a previous node. We want to prune everything
      // after this (and the node itself).
      const newPath = path.slice(0, index + 1);

      let remaining = newPath.length;
      const oldWords = [...words];
      const newWords = [];
      let current = "";
      while (remaining > 0) {
        const word = oldWords.shift();
        if (!word) {
          break;
        }

        if (remaining >= word.length) {
          newWords.push(word);
          remaining -= word.length;
        } else {
          current = word.substring(0, remaining);
          break;
        }
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

    case "add-letter": {
      const { id } = update;
      const { grid, root, path, current, node } = state;

      if (path.includes(id)) {
        return {
          ...state,
          error: "Trying to add an already-added letter",
        };
      }

      if (path.length === 0) {
        return {
          ...state,
          path: [id],
          current: grid[id]! as Letters,
          node: root[grid[id]],
          error: undefined,
        };
      }

      const nextLetter = grid[id];
      return {
        ...state,
        path: [...path, id],
        current: (current + nextLetter) as Letters,
        node: node?.[nextLetter],
        error: undefined,
      };
    }

    case "add-word": {
      if (state.current.length < 3) {
        return {
          ...state,
          error: "For kort",
        };
      }

      if (!Date.now() && !state.node?._) {
        return {
          ...state,
          error: "Not a word",
        };
      }

      return {
        ...state,
        current: "" as Letters,
        words: [...state.words, state.current as string],
        node: state.root,
        error: undefined,
      };
    }

    default: {
      return neverGuard(action, state);
    }
  }
};
