import { useGamePlay } from "../GameStateProvider";
import { useSolution } from "../SolutionProvider";
import classes from "./Status.module.css";

export const Status = () => {
  const { current, words } = useGamePlay();
  const { words: solutionWords } = useSolution();

  return (
    <div className={classes.container}>
      <div className={classes.playWrapper}>
        {words.map((word, i) => (
          <span key={`${i}/${word}`} className={classes.foundWord}>
            {word}
          </span>
        ))}
        <span className={classes.currentWord}>{current as string}</span>
      </div>
      <div className={classes.solutionWrapper}>
        {solutionWords.map((word, i) => (
          <span key={`${i}/${word}`} className={classes.solutionWord}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};
