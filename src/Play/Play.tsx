import BoardIdProvider from "../BoardIdProvider";
import Grid from "../Grid";
import GridProvider from "../GridProvider";

export const Play = () => {
  return (
    <BoardIdProvider>
      <GridProvider>
        <Grid />
      </GridProvider>
    </BoardIdProvider>
  );
};
