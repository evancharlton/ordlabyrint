import { useEffect, useReducer } from "react";
import { Outlet, useParams } from "react-router";
import { LanguageContext } from "./context";
import { reducer, State } from "./state";
import { Letters } from "../trie";
import { Loader } from "../spa-components/Loader";

export const LanguageProvider = () => {
  const { lang } = useParams();
  const [{ letters, words, error, trie }, dispatch] = useReducer(reducer, {
    error: undefined,
    words: [],
    letters: "" as Letters,
    trie: {},
  } satisfies State);

  const state = error
    ? "error"
    : !letters || !words.length
      ? "loading"
      : "loaded";

  useEffect(() => {
    const abortController = new AbortController();
    dispatch({ action: "start-loading" });
    fetch(
      `${import.meta.env.BASE_URL}/${lang}/words.json`.replace(/^\/\//, "/"),
      { signal: abortController.signal }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Response is not ok");
        }
        return res.json();
      })
      .then((words: string[]) => {
        dispatch({ action: "add-words", words });
      })
      .catch((ex) => {
        if (ex instanceof DOMException && ex.name === "AbortError") {
          return;
        }
        console.warn(ex);
        dispatch({ action: "add-error", error: ex });
      });

    fetch(`${import.meta.env.BASE_URL}/${lang}/letters`.replace(/^\/\//, "/"), {
      signal: abortController.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Response is not ok");
        }
        return res.text() as Promise<Letters>;
      })
      .then((letters: Letters) => {
        dispatch({ action: "add-letters", letters });
      })
      .catch((ex) => {
        if (ex instanceof DOMException && ex.name === "AbortError") {
          return;
        }
        console.warn(ex);
        dispatch({ action: "add-error", error: ex });
      });

    return () => {
      abortController.abort();
    };
  }, [lang]);

  if (state === "loading") {
    return <Loader />;
  } else if (state === "loaded") {
    return (
      <LanguageContext.Provider value={{ words, letters, trie }}>
        <Outlet />
      </LanguageContext.Provider>
    );
  } else if (state === "error") {
    return <h1>Error</h1>;
  } else {
    return null;
  }
};
