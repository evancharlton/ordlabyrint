import { createContext, useContext } from "react";

export const BoardIdContext = createContext<
  { id: string | number; fingerprint: string } | undefined
>(undefined);

export const useBoardId = () => {
  const context = useContext(BoardIdContext);
  if (!context) {
    throw new Error("Must be used within <BoardIdContext.Provider />!");
  }
  return context;
};
