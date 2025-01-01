import BoardIdProvider from "../BoardIdProvider";
import Buttons from "../Buttons";
import { GameStateProvider } from "../GameStateProvider";
import Grid from "../Grid";
import GridProvider from "../GridProvider";
import HistoryProvider from "../HistoryProvider";
import SolutionProvider from "../SolutionProvider";
import Status from "../Status";
import HamburgerMenu from "../HamburgerMenu";
import { ShareDialog } from "./ShareDialog";

export const Play = () => {
  return (
    <BoardIdProvider>
      <GridProvider>
        <HistoryProvider>
          <SolutionProvider>
            <GameStateProvider>
              <Status />
              <Grid />
              <Buttons />
              <HamburgerMenu />
              <ShareDialog />
            </GameStateProvider>
          </SolutionProvider>
        </HistoryProvider>
      </GridProvider>
    </BoardIdProvider>
  );
};
