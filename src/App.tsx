import { HashRouter, Route, Routes } from "react-router";
import "./App.css";
import LanguageProvider from "./LanguageProvider";
import GridSizeProvider from "./GridSizeProvider";
import Play from "./Play";
import LanguageSelector from "./spa-components/LanguageSelector";
import { SizeChooser } from "./SizeChooser";
import Page from "./Page";
import PwaContainer from "./spa-components/PwaContainer";

const App = () => {
  return (
    <PwaContainer appId="ordlabyrint">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Page />}>
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
    </PwaContainer>
  );
};

export default App;
