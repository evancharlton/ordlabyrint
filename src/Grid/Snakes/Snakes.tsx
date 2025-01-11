import { useGridSize } from "../../GridSizeProvider";
import { Solution, useHistory } from "../../HistoryProvider";
import classes from "./Snakes.module.css";

const SIZE = 1000;
const LINE_WIDTH = 15;

const PreviousSolution = ({ path }: Solution) => {
  const { width, height } = useGridSize();
  const stepX = SIZE / width;
  console.log(`TCL ~ PreviousSolution ~ stepX:`, stepX);
  const stepY = SIZE / height;

  const coords = path
    .map((id, i) => {
      const [x, y] = id.split(",").map((v) => +v);
      const posX = stepX / 2 + stepX * x;
      const posY = stepY / 2 + stepY * y;
      return `${i === 0 ? "M" : "L"} ${posX} ${posY}`;
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
  const { previousSolutions } = useHistory();

  return (
    <svg
      className={classes.snakes}
      style={{
        gridArea: "stack",
        width: "100%",
        height: "100%",
      }}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
    >
      {previousSolutions.map((sol) => (
        <PreviousSolution key={sol.path.join("-")} {...sol} />
      ))}
    </svg>
  );
};
