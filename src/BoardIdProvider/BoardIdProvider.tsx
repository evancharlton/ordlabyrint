import React from "react";
import { BoardIdContext } from "./context";
import { useParams } from "react-router";
import { mulberry32 } from "../random";

const useDateId = () => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth(), now.getDate()].join("-");
};

type Props = {
  children: React.ReactNode;
  id?: string | number;
};

export const BoardIdProvider = ({ children, id: providedId }: Props) => {
  const { id: urlId } = useParams();
  const defaultId = useDateId();
  const id = providedId ?? urlId ?? defaultId;
  console.log(`BoardIdProvider re-render`);
  return (
    <BoardIdContext.Provider value={{ random: mulberry32(id), id }}>
      {children}
    </BoardIdContext.Provider>
  );
};
