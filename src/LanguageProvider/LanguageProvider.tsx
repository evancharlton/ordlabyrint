import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import { LanguageContext } from "./context";

export const LanguageProvider = () => {
  const { lang } = useParams();
  const [words, setWords] = useState<string[]>([]);
  const [state, setState] = useState<
    "pending" | "loading" | "loaded" | "error"
  >("pending");

  useEffect(() => {
    const abortController = new AbortController();
    setState("loading");
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
      .then((words) => {
        setWords(words);
        setState("loaded");
      })
      .catch((ex) => {
        if (ex instanceof DOMException && ex.name === "AbortError") {
          return;
        }
        console.warn(ex);
        setState("error");
      });
    return () => {
      abortController.abort();
    };
  }, [lang]);

  if (state === "loading") {
    return <h1>...</h1>;
  } else if (state === "pending") {
    return <h3>...</h3>;
  } else if (state === "loaded") {
    return (
      <LanguageContext.Provider value={{ words }}>
        <Outlet />
      </LanguageContext.Provider>
    );
  } else if (state === "error") {
    return <h1>Error</h1>;
  } else {
    return <h1>???</h1>;
  }
};
