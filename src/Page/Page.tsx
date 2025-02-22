import { ContextType, useCallback, useState } from "react";
import { MdHelpOutline } from "react-icons/md";
import { Outlet } from "react-router";
import classes from "./Page.module.css";
import { DialogKind, PageContext } from "./context";
import { RulesDialog } from "./RulesDialog";
import { SettingsDialog, SettingsProvider } from "../SettingsProvider";
import { AboutDialog } from "./AboutDialog";
import { Header } from "../spa-components/Header";
import logo from "../logo.svg";
import { StorageContainer } from "../StorageContainer";

export const Page = () => {
  const [dialog, setDialog] =
    useState<NonNullable<ContextType<typeof PageContext>>["dialog"]>(undefined);

  return (
    <div className={classes.page}>
      <StorageContainer>
        <SettingsProvider>
          <Header className={classes.header} logo={logo} title="Ordlabyrint">
            <button onClick={() => setDialog("rules")}>
              <MdHelpOutline />
            </button>
          </Header>
          <div className={classes.content}>
            <PageContext.Provider
              value={{
                dialog,
                showDialog: setDialog,
                closeDialog: useCallback(
                  (which: DialogKind) =>
                    setDialog((v) => (v === which ? undefined : v)),
                  [],
                ),
              }}
            >
              <Outlet />
              <RulesDialog />
              <SettingsDialog />
              <AboutDialog />
            </PageContext.Provider>
          </div>
        </SettingsProvider>
      </StorageContainer>
    </div>
  );
};

export { ButtonsPortal } from "../spa-components/Header/Header";
