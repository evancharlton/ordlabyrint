import { ComponentProps } from "react";
import { Modal as SpaModal } from "../spa-components/Modal";
import { DialogKind, usePageContext } from "./context";

type Props = Omit<ComponentProps<typeof SpaModal>, "open" | "onClose"> & {
  kind: DialogKind;
};

export const Modal = ({ kind, ...props }: Props) => {
  const { dialog, closeDialog } = usePageContext();
  return (
    <SpaModal
      {...props}
      open={dialog === kind}
      onClose={() => closeDialog(kind)}
    />
  );
};
