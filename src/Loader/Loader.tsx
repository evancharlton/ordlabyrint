import classes from "./Loader.module.css";
import "./Loader.css";

type Props = {
  text?: string;
  children?: React.ReactNode;
  className?: string;
};

export const Loader = ({ text, children, className }: Props) => (
  <div className={[classes.container, className].filter(Boolean).join(" ")}>
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    {text && <span className={classes.text}>{text}</span>}
    {children}
  </div>
);
