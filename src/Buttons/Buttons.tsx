import { useGamePlay } from "../GameStateProvider";
import classes from "./Buttons.module.css";
import { MdBackspace, MdKeyboardReturn, MdRestartAlt } from "react-icons/md";

export const Buttons = () => {
  const { backspace, reset, addWord, current, path } = useGamePlay();

  return (
    <div className={classes.container}>
      <button onClick={() => reset()}>
        <MdRestartAlt />
      </button>
      <button disabled={path.length === 0} onClick={() => backspace()}>
        <MdBackspace />
      </button>
      <button disabled={current.length < 3} onClick={() => addWord()}>
        <MdKeyboardReturn />
      </button>
    </div>
  );
};
