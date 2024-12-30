import { useNavigate, useParams } from "react-router";
import { useGamePlay } from "../GameStateProvider";
import classes from "./Buttons.module.css";
import { useSolution } from "../SolutionProvider";
import { useState } from "react";
import { neverGuard } from "../neverGuard";

export const Buttons = () => {
  const { reset, addWord, current } = useGamePlay();
  const { lang, size } = useParams();
  const navigate = useNavigate();

  const [controller, setController] = useState<AbortController | undefined>();
  const { state, solve } = useSolution();

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
              controller?.abort("cancelled");
              return;
            }
            case "unsolvable":
            case "solved":
            case "pending":
            case "aborted": {
              const c = new AbortController();
              setController(c);
              solve(c.signal);
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
