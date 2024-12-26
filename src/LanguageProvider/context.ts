import { createContext, useContext } from "react";

export const LanguageContext = createContext<
  { words: string[]; lookup: Set<string> } | undefined
>(undefined);

export const useWords = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("Must be rendered within <LanguageContext.Provider />!");
  }

  return context;
};
