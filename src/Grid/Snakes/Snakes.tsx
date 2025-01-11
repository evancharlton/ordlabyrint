import { useGridSize } from "../../GridSizeProvider";
import { Solution, useHistory } from "../../HistoryProvider";
import classes from "./Snakes.module.css";

const PreviousSolution = ({ path }: Solution) => {
  const coords = path
    .map((id, i) => {
      const [x, y] = id.split(",").map((v) => +v);
      return `${i === 0 ? "M" : "L"} ${x * 10 + 5} ${y * 10 + 5}`;
    })
    .join("\n");
  console.log(`TCL ~ coords ~ coords:`, coords);

  return (
    <>
      <path
        fill="transparent"
        strokeWidth={2}
        strokeLinejoin="round"
        d={coords}
        className={classes.border}
      />
      <path
        fill="transparent"
        strokeWidth={1}
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
      viewBox={`0 0 ${width * 10} ${height * 10}`}
    >
      {previousSolutions.map((sol) => (
        <PreviousSolution key={sol.path.join("-")} {...sol} />
      ))}
    </svg>
  );
};
