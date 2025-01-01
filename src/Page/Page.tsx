import {
  ContextType,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MdHelpOutline } from "react-icons/md";
import { Link, Outlet, useParams } from "react-router";
import classes from "./Page.module.css";
import { DialogKind, PageContext, usePageContext } from "./context";
import { createPortal } from "react-dom";
import { RulesDialog } from "./RulesDialog";

export const Page = () => {
  const { lang } = useParams();
  const [buttons, setButtons] = useState<HTMLDivElement | null>(null);
  const [dialog, setDialog] =
    useState<NonNullable<ContextType<typeof PageContext>>["dialog"]>(undefined);

  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <h1>
          <Link to={`/${lang || ""}`}>Ordlabyrint</Link>
        </h1>
        <div
          className={classes.buttons}
          ref={(ref) => {
            setButtons(ref);
          }}
        >
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
            closeDialog: useCallback(() => setDialog(undefined), []),
          }}
        >
          <Outlet />
          <RulesDialog />
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
