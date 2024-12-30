import { CellId } from "../GridProvider";

export type Solution = {
  words: string[];
  path: CellId[];
  timestamp: number;
};
