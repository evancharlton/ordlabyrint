import { ContextType, ReactNode, useCallback, useState } from "react";
import { MdHelpOutline, MdOutlineRefresh } from "react-icons/md";
import { Link, Outlet, useParams } from "react-router";
import classes from "./Page.module.css";
import { DialogKind, PageContext, usePageContext } from "./context";
import { createPortal } from "react-dom";
import { RulesDialog } from "./RulesDialog";
import { Modal } from "./Modal";
import { usePwa } from "../PwaContainer";

export const Page = () => {
  const { lang } = useParams();
  const [buttons, setButtons] = useState<HTMLDivElement | null>(null);
  const [dialog, setDialog] =
    useState<NonNullable<ContextType<typeof PageContext>>["dialog"]>(undefined);

  const { updateNeeded, performUpdate } = usePwa();
  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <h1>
          <Link to={`/${lang || ""}`}>
            <img src="/ordlabyrint.svg" />
            Ordlabyrint
          </Link>
        </h1>
        <div
          className={classes.buttons}
          ref={(ref) => {
            setButtons(ref);
          }}
        >
          {updateNeeded ? (
            <button
              title="oppdater appen"
              onClick={() => performUpdate()}
              className={classes.refresh}
            >
              <MdOutlineRefresh />
            </button>
          ) : null}
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
          <Modal title="Ordlabyrint" kind="about">
            <strong>Ordlabyrint</strong>
          </Modal>
        </PageContext.Provider>
      </div>
    </div>
  );
};

export const ButtonsPortal = ({ children }: { children: ReactNode }) => {
  const { hamburgerContainer } = usePageContext();
  if (!hamburgerContainer) {
    return null;
  }
  return createPortal(children, hamburgerContainer);
};
