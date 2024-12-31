import { Link } from "react-router";

export const LanguageSelector = () => {
  return (
    <>
      <Link to="/nb">bokmål</Link>
      <Link to="/nn">nynorsk</Link>
    </>
  );
};
