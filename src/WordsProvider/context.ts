import { createContext, useContext } from "react";
import { Letters, Trie } from "../trie";

export const WordsContext = createContext<
  | {
      words: string[];
      letters: Letters;
      trie: Trie;
    }
  | undefined
>(undefined);

export const useWords = () => {
  const context = useContext(WordsContext);
  if (!context) {
    throw new Error("Must be rendered within <WordsContext.Provider />!");
  }

  return context;
};
