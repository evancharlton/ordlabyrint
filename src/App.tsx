import { HashRouter, Link, Route, Routes } from "react-router";
import "./App.css";
import LanguageProvider from "./LanguageProvider";
import GridProvider from "./GridSizeProvider";
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
      <Link to="./6x6">6x6</Link>
      <Link to="./8x8">8x8</Link>
      <Link to="./10x10">10x10</Link>
    </>
  );
};

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/">
          <Route path="" element={<LanguageSelector />} />
          <Route path=":lang" element={<LanguageProvider />}>
            <Route path="" element={<SizeChooser />} />
            <Route path=":size" element={<GridProvider />}>
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
