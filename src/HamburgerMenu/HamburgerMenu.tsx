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

  const { previousSolutions } = useHistory();

  return (
    <dialog key="hamburger" ref={dialogRef}>
      <div className={classes.header}>
        <button onClick={() => dialogRef.current?.close()}>
          <MdClose />
        </button>
      </div>
      <button className={classes.action}>
        <MdRestartAlt /> Start på nytt
      </button>
      <button className={classes.action}>
        <MdLink /> Del puslespill
      </button>
      <div className={classes.history}>
        {previousSolutions.map((solution) => (
          <PreviousSolution key={solution.timestamp} {...solution} />
        ))}
      </div>
      <button className={classes.action}>
        <MdDoneAll /> Vis den best løsningen
      </button>
      <button className={classes.action}>
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
