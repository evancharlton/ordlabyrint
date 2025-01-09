import React from "react";
import { BoardIdContext } from "./context";
import { useParams } from "react-router";
import { useGridSize } from "../GridSizeProvider";
import { hash, RandomProvider } from "../spa-components/RandomProvider";

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
  const { lang, id: urlId } = useParams();
  const defaultId = useDateId();
  const id = providedId ?? urlId ?? defaultId;
  const hashedId = hash(id);

  const { key } = useGridSize();
  const fingerprint = `${lang}/${key}/${hashedId}`;

  return (
    <BoardIdContext.Provider key={id} value={{ id: hashedId, fingerprint }}>
      <RandomProvider seed={hashedId}>{children}</RandomProvider>
    </BoardIdContext.Provider>
  );
};
