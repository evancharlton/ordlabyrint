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
      const { root } = state;
      return {
        ...state,
        path: [],
        current: "" as Letters,
        words: [],
        error: undefined,
        node: root,
      };
    }

    case "remove-letter": {
      const { id } = update;
      const { grid, path, root, words: oldWords, current: oldCurrent } = state;
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
          current = word.substring(consumed + 1);
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
      const { current, node, root, words } = state;

      if (current.length < 3) {
        return {
          ...state,
          error: "For kort",
        };
      }

      if (!node?._) {
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

    default: {
      return neverGuard(action, state);
    }
  }
};
