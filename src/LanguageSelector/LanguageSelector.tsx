import { Link } from "react-router";
import classes from "./LanguageSelector.module.css";

export const LanguageSelector = () => {
  return (
    <div className={classes.container}>
      <Link to="/nb">bokmål</Link>
      <Link to="/nn">nynorsk</Link>
    </div>
  );
};
