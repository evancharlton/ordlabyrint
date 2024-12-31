import { Link } from "react-router";

export const SizeChooser = () => {
  return (
    <>
      <Link to="./5x5">5x5</Link>
      <Link to="./9x9">9x9</Link>
      <Link to="./11x11">11x11</Link>
    </>
  );
};
