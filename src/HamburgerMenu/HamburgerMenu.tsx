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
  const { addHeaderItem } = usePageContext();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    addHeaderItem({
      id: "hamburger",
      item: (
        <button onClick={() => dialogRef.current?.showModal()}>
          <MdMenu />
        </button>
      ),
      weight: 10,
    });
  }, [addHeaderItem]);

  const { reset } = useGamePlay();
  const { id } = useBoardId();
  const { previousSolutions } = useHistory();
  const { solve } = useSolution();
  const { lang, size } = useParams();
  const navigate = useNavigate();

  return (
    <dialog key="hamburger" ref={dialogRef}>
      <div className={classes.header}>
        <button onClick={() => dialogRef.current?.close()}>
          <MdClose />
        </button>
      </div>
      <button
        className={classes.action}
        onClick={() => {
          reset();
          dialogRef.current?.close();
        }}
      >
        <MdRestartAlt /> Start på nytt
      </button>
      <button
        className={classes.action}
        onClick={() => {
          alert(id);
          dialogRef.current?.close();
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
          dialogRef.current?.close();
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
  );
};
