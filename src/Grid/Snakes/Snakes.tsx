import { useGridSize } from "../../GridSizeProvider";
import { Solution, useHistory } from "../../HistoryProvider";
import classes from "./Snakes.module.css";

const MULTIPLIER = 100;
const LINE_WIDTH = 10;

const PreviousSolution = ({ path }: Solution) => {
  const coords = path
    .map((id, i) => {
      const [x, y] = id.split(",").map((v) => +v);
      return `${i === 0 ? "M" : "L"} ${x * MULTIPLIER + MULTIPLIER / 2 - LINE_WIDTH} ${y * MULTIPLIER + MULTIPLIER / 2 - LINE_WIDTH}`;
    })
    .join("\n");

  return (
    <>
      <path
        fill="transparent"
        strokeWidth={LINE_WIDTH}
        strokeLinejoin="round"
        d={coords}
        className={classes.snake}
      />
    </>
  );
};

export const Snakes = () => {
  const { width, height } = useGridSize();
  const { previousSolutions } = useHistory();

  return (
    <svg
      className={classes.snakes}
      style={{
        gridArea: "stack",
        width: "100%",
        height: "100%",
      }}
      viewBox={`0 0 ${width * MULTIPLIER} ${height * MULTIPLIER}`}
    >
      {previousSolutions.map((sol) => (
        <PreviousSolution key={sol.path.join("-")} {...sol} />
      ))}
    </svg>
  );
};
