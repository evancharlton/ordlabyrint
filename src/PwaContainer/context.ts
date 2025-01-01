import { createContext, useContext } from "react";

export const PwaContext = createContext<
  | {
      updateNeeded: boolean;
      performUpdate: () => void;
      error: unknown | undefined;
    }
  | undefined
>(undefined);

export const usePwa = () => {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error("usePwa() must be used inside of <PwaContainer>");
  }
  return context;
};
