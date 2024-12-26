import { createContext, useContext } from "react";
import { Trie } from "../trie";

export const LanguageContext = createContext<
  | {
      words: string[];
      letters: string;
      trie: Trie;
    }
  | undefined
>(undefined);

export const useWords = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("Must be rendered within <LanguageContext.Provider />!");
  }

  return context;
};
