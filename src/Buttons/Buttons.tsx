import { useNavigate, useParams } from "react-router";
import { useGamePlay } from "../GameStateProvider";
import { useSolution } from "../SolutionProvider";
import classes from "./Buttons.module.css";
import {
  MdBackspace,
  MdKeyboardReturn,
  MdOutlineAutorenew,
  MdRestartAlt,
} from "react-icons/md";

export const Buttons = () => {
  const navigate = useNavigate();
  const { lang, size } = useParams();
  const { state } = useSolution();
  const { backspace, reset, addWord, current, path, solved } = useGamePlay();

  return (
    <div className={classes.container}>
      <div className={classes.buttons}>
        {state === "solved" ? (
          <button
            title="Nytt puslespill"
            onClick={() => {
              navigate(`/${lang}/${size}/${Date.now()}`);
            }}
          >
            <MdOutlineAutorenew />
          </button>
        ) : (
          <button disabled={state !== "pending"} onClick={() => reset()}>
            <MdRestartAlt />
          </button>
        )}
        <button
          disabled={solved || path.length === 0}
          onClick={() => backspace()}
        >
          <MdBackspace />
        </button>
        <button disabled={current.length < 3} onClick={() => addWord()}>
          <MdKeyboardReturn />
        </button>
      </div>
    </div>
  );
};
