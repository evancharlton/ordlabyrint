import { ReactNode, useCallback, useState } from "react";
import { Settings, SettingsContext } from "./context";

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>({
    showPath: false,
  });

  const update = useCallback((delta: Partial<Settings>) => {
    setSettings((old) => ({ ...old, ...delta }));
  }, []);

  return (
    <SettingsContext.Provider value={{ ...settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
};
