import BoardIdProvider from "../BoardIdProvider";
import Buttons from "../Buttons";
import { GameStateProvider } from "../GameStateProvider";
import Grid from "../Grid";
import GridProvider from "../GridProvider";
import Status from "../Status";

export const Play = () => {
  console.log(`Play re-rendered`);
  return (
    <BoardIdProvider>
      <GridProvider>
        <GameStateProvider>
          <Status />
          <Grid />
          <Buttons />
        </GameStateProvider>
      </GridProvider>
    </BoardIdProvider>
  );
};
