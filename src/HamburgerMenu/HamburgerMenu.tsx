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
      <dialog
        className={classes.hamburger}
        ref={dialogRef}
        onClose={() => closeDialog("hamburger")}
      >
        <div className={classes.header}>
          <button onClick={() => closeDialog("hamburger")}>
            <MdClose />
          </button>
        </div>
        <button
          className={classes.action}
          onClick={() => {
            reset();
            closeDialog("hamburger");
          }}
        >
          <MdRestartAlt /> Start på nytt
        </button>
        <button
          className={classes.action}
          onClick={() => {
            showDialog("share");
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
            closeDialog("hamburger");
          }}
        >
          <MdDoneAll /> Vis den beste løsningen
        </button>
        <button
          className={classes.action}
          onClick={() => {
            navigate(`/${lang}/${size}/${Date.now()}`);
            closeDialog("hamburger");
          }}
        >
          <MdOutlineAutorenew /> Nytt puslespill
        </button>
        <button className={classes.action}>
          <MdOutlineSettings /> Instillinger
        </button>
        <button className={classes.action} onClick={() => showDialog("about")}>
          <MdInfoOutline /> Om Ordlabyrint
        </button>
      </dialog>
    </>
  );
};
