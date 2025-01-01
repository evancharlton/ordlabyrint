import { Link } from "react-router";
import classes from "./SizeChooser.module.css";

const SIZES: (number | [number, number])[] = [4, 5, 7, 9] as const;

export const SizeChooser = () => {
  return (
    <div className={classes.container}>
      {SIZES.map((size) => {
        const x = typeof size === "number" ? size : size[0];
        const y = typeof size === "number" ? size : size[1];

        return (
          <Link key={`${x}x${y}`} to={`./${x}x${y}`}>
            {x}
            <span>&#x2715;</span>
            {y}
          </Link>
        );
      })}
    </div>
  );
};
