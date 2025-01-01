import { ReactNode, useRef, useEffect } from "react";
import { DialogKind, usePageContext } from "../context";
import classes from "./Modal.module.css";
import { MdClose } from "react-icons/md";

type Props = {
  title: string;
  kind: NonNullable<DialogKind>;
  children: ReactNode;
  className?: string;
};

export const Modal = ({ children, kind, title, className }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { dialog, closeDialog } = usePageContext();

  useEffect(() => {
    if (dialog === kind) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [dialog, kind]);

  return (
    <dialog
      ref={dialogRef}
      onClose={() => closeDialog(kind)}
      className={[classes.dialog, className].filter(Boolean).join(" ")}
    >
      <div className={classes.header}>
        <h2>{title}</h2>
        <button className={classes.close} onClick={() => closeDialog(kind)}>
          <MdClose />
        </button>
      </div>
      <div className={classes.content}>{children}</div>
    </dialog>
  );
};
