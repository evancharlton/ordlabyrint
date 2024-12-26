import BoardIdProvider from "../BoardIdProvider";
import Grid from "../Grid";
import GridProvider from "../GridProvider";

export const Play = () => {
  console.log(`Play re-rendered`);
  return (
    <BoardIdProvider>
      <GridProvider>
        <Grid />
      </GridProvider>
    </BoardIdProvider>
  );
};
