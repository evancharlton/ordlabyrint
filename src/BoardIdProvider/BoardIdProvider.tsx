import React from "react";
import { BoardIdContext } from "./context";
import { useParams } from "react-router";
import { mulberry32 } from "../random";

const useDateId = () => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth(), now.getDate()].join("-");
};

export const BoardIdProvider = ({
  children,
  id: providedId,
}: {
  children: React.ReactNode;
  id?: string | number;
}) => {
  const { id: urlId } = useParams();
  const defaultId = useDateId();
  const id = providedId ?? urlId ?? defaultId;
  return (
    <BoardIdContext.Provider value={{ random: mulberry32(id), id }}>
      {children}
    </BoardIdContext.Provider>
  );
};
