import BoardIdProvider from "../BoardIdProvider";
import { GameStateProvider } from "../GameStateProvider";
import Grid from "../Grid";
import GridProvider from "../GridProvider";

export const Play = () => {
  console.log(`Play re-rendered`);
  return (
    <BoardIdProvider>
      <GridProvider>
        <GameStateProvider>
          <Grid />
        </GameStateProvider>
      </GridProvider>
    </BoardIdProvider>
  );
};
