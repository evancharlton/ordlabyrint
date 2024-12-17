import { createContext, useContext } from "react";

export const GridSizeContext = createContext<
  { width: number; height: number } | undefined
>(undefined);

export const useGridSize = () => {
  const context = useContext(GridSizeContext);
  if (!context) {
    throw new Error("Must be used within <GridSizeContext.Provider />!");
  }
  return context;
};
