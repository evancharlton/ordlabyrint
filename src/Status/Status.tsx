import { MdOutlineOpenInNew } from "react-icons/md";
import { useGamePlay } from "../GameStateProvider";
import { useSolution } from "../SolutionProvider";
import classes from "./Status.module.css";
import { Fragment } from "react/jsx-runtime";

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
      <MdOutlineOpenInNew />
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
            <Fragment key={`${i}/${word}`}>
              <NaobLink className={classes.foundWord}>{word}</NaobLink>
            </Fragment>
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
              <Fragment key={`${i}/${word}`}>
                {i > 0 ? <hr /> : null}
                <NaobLink className={classes.solutionWord}>{word}</NaobLink>
              </Fragment>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};
