import { Fragment, useEffect, useRef } from "react";
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
import { Action, Content, OtherApps } from "../spa-components/HamburgerMenu";
import { ShareDialog } from "../spa-components/ShareDialog";
import { useBoardId } from "../BoardIdProvider";
import { ShareButton } from "../spa-components/ShareButton";
import { NaobLink } from "../spa-components/NaobLink";

const useCurrentUrl = () => {
  const { id } = useBoardId();

  const { lang, size } = useParams();
  const href = useHref(`/${lang}/${size}/${id}`);

  return `${window.location.protocol}/${window.location.host}/${href}`;
};

export const HamburgerMenu = () => {
  const { dialog, closeDialog, showDialog } = usePageContext();

  const { reset } = useGamePlay();
  const { solve } = useSolution();
  const { lang, size } = useParams();
  const navigate = useNavigate();
  const { state } = useSolution();

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
      <Content className={classes.history}>
        <GameHistory />
      </Content>
      <Action
        disabled={state !== "pending"}
        icon={MdDoneAll}
        text="Vis den beste løsningen"
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
      <OtherApps />
    </SpaHamburgerMenu>
  );
};

const GameHistory = () => {
  const { previousSolutions } = useHistory();
  return previousSolutions.map((solution) => (
    <PreviousSolution key={solution.timestamp} {...solution} />
  ));
};

const PreviousSolution = ({ words }: Solution) => {
  const url = useCurrentUrl();
  const text = `Jeg har krysset labyrinten med ${words.length} ord!\n\n${url}`;
  return (
    <div className={classes.previousSolution}>
      <ShareButton shareText={text}>{""}</ShareButton>
      {words.map((word, i) => (
        <Fragment key={`${i}/${word}`}>
          {i > 0 ? <hr /> : null}
          <NaobLink className={classes.word}>{word}</NaobLink>
        </Fragment>
      ))}
    </div>
  );
};
