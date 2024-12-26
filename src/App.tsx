import { HashRouter, Link, Route, Routes } from "react-router";
import "./App.css";
import LanguageProvider from "./LanguageProvider";
import GridSizeProvider from "./GridSizeProvider";
import Play from "./Play";

const LanguageSelector = () => {
  return (
    <>
      <Link to="/nb">bokmål</Link>
      <Link to="/nn">nynorsk</Link>
    </>
  );
};

const SizeChooser = () => {
  return (
    <>
      <Link to="./5x5">5x5</Link>
      <Link to="./9x9">9x9</Link>
      <Link to="./11x11">11x11</Link>
    </>
  );
};

const App = () => {
  console.log(`App re-rendered`);
  return (
    <HashRouter>
      <Routes>
        <Route path="/">
          <Route path="" element={<LanguageSelector />} />
          <Route path=":lang" element={<LanguageProvider />}>
            <Route path="" element={<SizeChooser />} />
            <Route path=":size" element={<GridSizeProvider />}>
              <Route path="" element={<Play />} />
              <Route path=":id" element={<Play />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
