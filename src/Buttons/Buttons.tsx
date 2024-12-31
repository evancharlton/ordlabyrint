import { useNavigate, useParams } from "react-router";
import { useGamePlay } from "../GameStateProvider";
import classes from "./Buttons.module.css";
import { useSolution } from "../SolutionProvider";
import { neverGuard } from "../neverGuard";

export const Buttons = () => {
  const { reset, addWord, current } = useGamePlay();
  const { lang, size } = useParams();
  const navigate = useNavigate();

  const { abort, state, solve } = useSolution();

  return (
    <div className={classes.container}>
      <button onClick={() => navigate(`/${lang}/${size}/${Date.now()}`)}>
        new
      </button>
      <button disabled={current.length < 3} onClick={() => addWord()}>
        word
      </button>
      <button onClick={() => reset()}>reset</button>
      <button
        onClick={() => {
          switch (state) {
            case "solving": {
              abort();
              return;
            }
            case "unsolvable":
            case "solved":
            case "pending":
            case "aborted": {
              solve();
              return;
            }
            default: {
              return neverGuard(state, undefined);
            }
          }
        }}
      >
        {state}
      </button>
    </div>
  );
};
