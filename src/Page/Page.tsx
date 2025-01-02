import { ContextType, ReactNode, useCallback, useState } from "react";
import { MdHelpOutline } from "react-icons/md";
import { Link, Outlet, useParams } from "react-router";
import classes from "./Page.module.css";
import { DialogKind, PageContext, usePageContext } from "./context";
import { createPortal } from "react-dom";
import { RulesDialog } from "./RulesDialog";
import { SettingsDialog, SettingsProvider } from "../SettingsProvider";
import { AboutDialog } from "./AboutDialog";
import logo from "../logo.svg";
import { UpdateButton } from "../spa-components/PwaContainer/UpdateButton";

export const Page = () => {
  const { lang } = useParams();
  const [buttons, setButtons] = useState<HTMLDivElement | null>(null);
  const [dialog, setDialog] =
    useState<NonNullable<ContextType<typeof PageContext>>["dialog"]>(undefined);

  return (
    <SettingsProvider>
      <div className={classes.page}>
        <div className={classes.header}>
          <h1>
            <Link to={`/${lang || ""}`}>
              <img src={logo} />
              Ordlabyrint
            </Link>
          </h1>
          <div
            className={classes.buttons}
            ref={(ref) => {
              setButtons(ref);
            }}
          >
            <UpdateButton />
            <button onClick={() => setDialog("rules")}>
              <MdHelpOutline />
            </button>
          </div>
        </div>
        <div className={classes.content}>
          <PageContext.Provider
            value={{
              hamburgerContainer: buttons,
              dialog,
              showDialog: setDialog,
              closeDialog: useCallback(
                (which: DialogKind) =>
                  setDialog((v) => (v === which ? undefined : v)),
                []
              ),
            }}
          >
            <Outlet />
            <RulesDialog />
            <SettingsDialog />
            <AboutDialog />
          </PageContext.Provider>
        </div>
      </div>
    </SettingsProvider>
  );
};

export const ButtonsPortal = ({ children }: { children: ReactNode }) => {
  const { hamburgerContainer } = usePageContext();
  if (!hamburgerContainer) {
    return null;
  }
  return createPortal(children, hamburgerContainer);
};
