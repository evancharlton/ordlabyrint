import { useGamePlay } from "../GameStateProvider";
import { useSolution } from "../SolutionProvider";
import classes from "./Buttons.module.css";
import { MdBackspace, MdKeyboardReturn, MdRestartAlt } from "react-icons/md";

export const Buttons = () => {
  const { state } = useSolution();
  const { backspace, reset, addWord, current, path, error, solved } =
    useGamePlay();

  return (
    <div className={classes.container}>
      <div className={classes.buttons}>
        <button disabled={state !== "pending"} onClick={() => reset()}>
          <MdRestartAlt />
        </button>
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
      <div className={classes.message}>{error}</div>
    </div>
  );
};
