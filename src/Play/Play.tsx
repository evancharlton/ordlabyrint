import BoardIdProvider from "../BoardIdProvider";
import Buttons from "../Buttons";
import { GameStateProvider } from "../GameStateProvider";
import Grid from "../Grid";
import GridProvider from "../GridProvider";
import HistoryProvider from "../HistoryProvider";
import SolutionProvider from "../SolutionProvider";
import Status from "../Status";

export const Play = () => {
  console.log(`Play re-rendered`);
  return (
    <BoardIdProvider>
      <GridProvider>
        <HistoryProvider>
          <SolutionProvider>
            <GameStateProvider>
              <Status />
              <Grid />
              <Buttons />
            </GameStateProvider>
          </SolutionProvider>
        </HistoryProvider>
      </GridProvider>
    </BoardIdProvider>
  );
};
