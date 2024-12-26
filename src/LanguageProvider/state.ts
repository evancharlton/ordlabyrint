import { Reducer } from "react";
import { neverGuard } from "../neverGuard";
import { construct, Trie } from "../trie";

export type State = {
  error: Error | undefined;
  words: string[];
  letters: string;
  trie: Trie;
};

type Action =
  | { action: "start-loading" }
  | { action: "add-words"; words: string[] }
  | { action: "add-letters"; letters: string }
  | { action: "add-error"; error: Error };

export const reducer: Reducer<State, Action> = (state, update) => {
  const { action } = update;
  switch (action) {
    case "start-loading": {
      return {
        error: undefined,
        words: [],
        letters: "",
        trie: {},
      };
    }

    case "add-words": {
      const { words } = update;
      return {
        ...state,
        words,
        trie: construct(words),
      };
    }

    case "add-letters": {
      const { letters } = update;
      return {
        ...state,
        letters,
      };
    }

    case "add-error": {
      return {
        ...state,
        error: update.error,
      };
    }

    default: {
      return neverGuard(action, state);
    }
  }
};
