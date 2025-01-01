import { createContext, useContext } from "react";

export type Settings = {
  showPath: boolean;
};

export const SettingsContext = createContext<
  { update: (delta: Partial<Settings>) => void } | undefined
>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("Must be used inside of <SettingsContext.Provider .. />!");
  }
  return context;
};
