import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { LanguageContext } from "./context";

export const LanguageProvider = () => {
  const [words, setWords] = useState<string[]>([]);
  const [state, setState] = useState<"pending" | "loading" | "loaded" | Error>(
    "pending"
  );

  useEffect(() => {
    // TODO: fetch
    setTimeout(() => {
      setState("loaded");
      setWords(["foo", "bar", "baz"]);
    }, 500);
  }, []);

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
  } else {
    return <h1>Error</h1>;
  }
};
