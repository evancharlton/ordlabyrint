import { createContext, ReactNode, useContext } from "react";

export type HeaderBarItem = {
  id: string;
  item: ReactNode;
  weight: number;
};

export const PageContext = createContext<
  { addHeaderItem: (item: HeaderBarItem) => void } | undefined
>(undefined);

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("Must be used within <PageContext .. />!");
  }
  return context;
};
