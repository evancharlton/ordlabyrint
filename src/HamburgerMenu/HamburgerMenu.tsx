import { useEffect, useRef } from "react";
import {
  MdDoneAll,
  MdInfoOutline,
  MdLink,
  MdOutlineAutorenew,
  MdOutlineSettings,
  MdRestartAlt,
} from "react-icons/md";
import { usePageContext } from "../Page/context";
import classes from "./HamburgerMenu.module.css";
import { Solution, useHistory } from "../HistoryProvider";
import { useGamePlay } from "../GameStateProvider";
import { useSolution } from "../SolutionProvider";
import { useHref, useNavigate, useParams } from "react-router";
import { HamburgerMenu as SpaHamburgerMenu } from "../spa-components/HamburgerMenu/HamburgerMenu";
import { Action } from "../spa-components/HamburgerMenu";
import { ShareDialog } from "../spa-components/ShareDialog";
import { useBoardId } from "../BoardIdProvider";

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

const useCurrentUrl = () => {
  const { id } = useBoardId();

  const { lang, size } = useParams();
  const href = useHref(`/${lang}/${size}/${id}`);

  return [`${window.location.protocol}/`, window.location.host, href].join("/");
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
    <SpaHamburgerMenu
      open={dialog === "hamburger"}
      onClose={() => closeDialog("hamburger")}
      onOpen={() => showDialog("hamburger")}
    >
      <Action
        icon={MdRestartAlt}
        text="Start på nytt"
        onClick={() => {
          reset();
          closeDialog("hamburger");
        }}
      />
      <Action
        icon={MdLink}
        text="Del puslespill"
        onClick={() => {
          showDialog("share");
        }}
      />
      <ShareDialog
        url={useCurrentUrl()}
        shareText="Prøve å løse denne ordlabyrinten!"
        open={dialog === "share"}
        onClose={() => closeDialog("share")}
      />
      <div className={classes.history}>
        {previousSolutions.map((solution) => (
          <PreviousSolution key={solution.timestamp} {...solution} />
        ))}
      </div>
      <Action
        icon={MdDoneAll}
        text="Vis den best løsningen"
        onClick={() => {
          solve();
          closeDialog("hamburger");
        }}
      />
      <Action
        icon={MdOutlineAutorenew}
        text="Nytt puslespill"
        onClick={() => {
          navigate(`/${lang}/${size}/${Date.now()}`);
          closeDialog("hamburger");
        }}
      />
      <Action
        icon={MdOutlineSettings}
        text="Instillinger"
        onClick={() => showDialog("settings")}
      />
      <Action
        icon={MdInfoOutline}
        text="Om Ordlabyrint"
        onClick={() => showDialog("about")}
      />
    </SpaHamburgerMenu>
  );
};
