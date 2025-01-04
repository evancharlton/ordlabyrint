import { useMemo } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { GridSizeContext } from "./context";

const SIZE = /^([\d]+)x([\d]+)$/;
const MAX_SIZE = 15;
const MIN_SIZE = 4;

export const GridSizeProvider = () => {
  const navigate = useNavigate();
  const { size } = useParams();

  if (!size) {
    throw new Error("React router misconfigured");
  }

  const value = useMemo(() => {
    const [_, w, h] = size?.match(SIZE) ?? [];

    const width = Math.max(Math.min(Math.floor(+w), MAX_SIZE), MIN_SIZE);
    const height = Math.max(Math.min(Math.floor(+h), MAX_SIZE), MIN_SIZE);
    const key = `${width}x${height}`;

    return {
      width,
      height,
      key,
    };
  }, [size]);

  if (!SIZE.test(size)) {
    navigate("..");
  }

  return (
    <GridSizeContext.Provider value={value} key={size}>
      <Outlet />
    </GridSizeContext.Provider>
  );
};
