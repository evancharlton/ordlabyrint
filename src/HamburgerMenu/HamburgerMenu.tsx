import { useEffect, useRef } from "react";
import {
  MdClose,
  MdDoneAll,
  MdInfoOutline,
  MdLink,
  MdMenu,
  MdOutlineAutorenew,
  MdOutlineSettings,
  MdRestartAlt,
} from "react-icons/md";
import { usePageContext } from "../Page/context";
import classes from "./HamburgerMenu.module.css";
import { Solution, useHistory } from "../HistoryProvider";
import { useGamePlay } from "../GameStateProvider";
import { useBoardId } from "../BoardIdProvider";
import { useSolution } from "../SolutionProvider";
import { useNavigate, useParams } from "react-router";
import { ButtonsPortal } from "../Page";

const PreviousSolution = ({ words }: Solution) => {
  return (
    <div className={classes.previousSolution}>
      {words.map((word) => (
        <span key={word} className={classes.word}>
          {word}
        </span>
      ))}
    </div>
  );
};

export const HamburgerMenu = () => {
  const { dialog, closeDialog, showDialog } = usePageContext();

  const { reset } = useGamePlay();
  const { id } = useBoardId();
  const { previousSolutions } = useHistory();
  const { solve } = useSolution();
  const { lang, size } = useParams();
  const navigate = useNavigate();

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialog === "hamburger") {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [dialog]);

  return (
    <>
      <ButtonsPortal>
        <button onClick={() => showDialog("hamburger")}>
          <MdMenu />
        </button>
      </ButtonsPortal>
      <dialog ref={dialogRef} onClose={() => showDialog(undefined)}>
        <div className={classes.header}>
          <button onClick={() => closeDialog()}>
            <MdClose />
          </button>
        </div>
        <button
          className={classes.action}
          onClick={() => {
            reset();
            closeDialog();
          }}
        >
          <MdRestartAlt /> Start på nytt
        </button>
        <button
          className={classes.action}
          onClick={() => {
            alert(id);
            closeDialog();
          }}
        >
          <MdLink /> Del puslespill
        </button>
        <div className={classes.history}>
          {previousSolutions.map((solution) => (
            <PreviousSolution key={solution.timestamp} {...solution} />
          ))}
        </div>
        <button
          className={classes.action}
          onClick={() => {
            solve();
            closeDialog();
          }}
        >
          <MdDoneAll /> Vis den best løsningen
        </button>
        <button
          className={classes.action}
          onClick={() => {
            navigate(`/${lang}/${size}/${Date.now()}`);
          }}
        >
          <MdOutlineAutorenew /> Nytt puslespill
        </button>
        <button className={classes.action}>
          <MdOutlineSettings /> Instillinger
        </button>
        <button className={classes.action}>
          <MdInfoOutline /> Om Ordlabyrint
        </button>
      </dialog>
    </>
  );
};
