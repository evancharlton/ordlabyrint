import { useGamePlay } from "../GameStateProvider";
import { useSolution } from "../SolutionProvider";
import classes from "./Status.module.css";

const NaobLink = ({
  children: word,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return (
    <a
      href={`https://naob.no/søk?q=${word}`}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {word}
    </a>
  );
};

export const Status = () => {
  const { current, words } = useGamePlay();
  const { words: solutionWords } = useSolution();

  const showCurrent = words.length > 0 || current;
  const showSolution = solutionWords.length > 0;

  return (
    <div className={classes.container}>
      {showCurrent ? (
        <div className={[classes.sequence, classes.playWrapper].join(" ")}>
          {words.map((word, i) => (
            <>
              {i > 0 ? <hr /> : null}
              <NaobLink key={`${i}/${word}`} className={classes.foundWord}>
                {word}
              </NaobLink>
            </>
          ))}
          {current ? (
            <>
              {words.length > 0 ? <hr /> : null}
              <span className={classes.currentWord}>{current as string}</span>
            </>
          ) : null}
        </div>
      ) : null}
      {showCurrent && showSolution ? <hr /> : null}
      {showSolution ? (
        <>
          <div
            className={[classes.sequence, classes.solutionWrapper].join(" ")}
          >
            {solutionWords.map((word, i) => (
              <NaobLink key={`${i}/${word}`} className={classes.solutionWord}>
                {word}
              </NaobLink>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};
