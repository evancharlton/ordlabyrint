import { useMemo } from "react";
import { Outlet } from "react-router";
import { WordsContext } from "./context";
import { construct, Letters } from "../trie";
import { Loader } from "../spa-components/Loader";
import { useLanguageData } from "../spa-components/DataProvider";

const asLetters = (res: Response) => res.text() as Promise<Letters>;

export const WordsProvider = () => {
  const { data: words, error: wordsError } =
    useLanguageData<string[]>("words.json");

  const { data: letters, error: letterError } = useLanguageData<Letters>(
    "letters",
    { processor: asLetters },
  );

  const trie = useMemo(() => {
    if (words) {
      return construct(words);
    }
    return {};
  }, [words]);

  const state =
    wordsError || letterError
      ? "error"
      : !letters || !words?.length
        ? "loading"
        : "loaded";

  if (state === "loading") {
    return <Loader />;
  } else if (state === "loaded" && words && letters) {
    return (
      <WordsContext.Provider value={{ words, letters: letters, trie }}>
        <Outlet />
      </WordsContext.Provider>
    );
  } else if (state === "error") {
    return <h1>Error</h1>;
  } else {
    return null;
  }
};
