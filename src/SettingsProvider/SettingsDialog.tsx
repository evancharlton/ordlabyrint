import { NavLink, useLocation, useParams } from "react-router";
import { Modal } from "../Page";
import classes from "./SettingsDialog.module.css";
import { ComponentProps, useEffect } from "react";
import { usePageContext } from "../Page/context";

const className: NonNullable<ComponentProps<typeof NavLink>["className"]> = ({
  isActive,
}) => (isActive ? classes.active : undefined);

export const SettingsDialog = () => {
  const { closeDialog } = usePageContext();
  const location = useLocation();

  const { size, id } = useParams();

  useEffect(() => {
    closeDialog("settings");
  }, [closeDialog, location]);

  return (
    <Modal title="Instillinger" kind="settings">
      <h3>Språk</h3>
      <div className={classes.buttons}>
        <NavLink
          className={className}
          to={["/nb", size, id].filter((v) => !!v).join("/")}
        >
          bokmål
        </NavLink>
        <NavLink
          className={className}
          to={["/nn", size, id].filter((v) => !!v).join("/")}
        >
          nynorsk
        </NavLink>
      </div>
    </Modal>
  );
};
