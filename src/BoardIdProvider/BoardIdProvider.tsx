import React from "react";
import { BoardIdContext } from "./context";
import { useParams } from "react-router";
import { hash, mulberry32 } from "../random";
import { useGridSize } from "../GridSizeProvider";

const useDateId = () => {
  const { width, height } = useGridSize();
  const now = new Date();
  return (
    [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-") +
    `@${width}x${height}`
  );
};

type Props = {
  children: React.ReactNode;
  id?: string | number;
};

export const BoardIdProvider = ({ children, id: providedId }: Props) => {
  const { id: urlId } = useParams();
  const defaultId = useDateId();
  const id = providedId ?? urlId ?? defaultId;
  const hashedId = hash(id);

  return (
    <BoardIdContext.Provider
      key={id}
      value={{ random: mulberry32(hashedId), id: hashedId }}
    >
      {children}
    </BoardIdContext.Provider>
  );
};
