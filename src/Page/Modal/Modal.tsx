import { ReactNode, useRef, useEffect } from "react";
import { DialogKind, usePageContext } from "../context";

export const Modal = ({
  children,
  kind,
}: {
  children: ReactNode;
  kind: NonNullable<DialogKind>;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { dialog, showDialog } = usePageContext();

  useEffect(() => {
    if (dialog === kind) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [dialog, kind]);

  return (
    <dialog ref={dialogRef} onClose={() => showDialog(undefined)}>
      {children}
    </dialog>
  );
};
