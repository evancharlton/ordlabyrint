import { createContext, ReactNode, useContext } from "react";

export type HeaderBarItem = {
  id: string;
  item: ReactNode;
  weight: number;
};

export type DialogKind =
  | "hamburger"
  | "settings"
  | "share"
  | "solve"
  | "about"
  | "rules"
  | undefined;

export const PageContext = createContext<
  | {
      hamburgerContainer: Element | DocumentFragment | null;
      dialog: DialogKind;
      showDialog: (which: DialogKind) => void;
      closeDialog: () => void;
    }
  | undefined
>(undefined);

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("Must be used within <PageContext .. />!");
  }
  return context;
};
