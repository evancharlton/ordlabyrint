import { useMemo } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { GridSizeContext } from "./context";

const SIZE = /^([\d]+)x([\d]+)$/;
const MAX_SIZE = 15;
const MIN_SIZE = 4;

export const GridSizeProvider = () => {
  const navigate = useNavigate();
  const { size } = useParams();
  console.log(`GridSizeProvider re-rendered`);

  if (!size) {
    throw new Error("React router misconfigured");
  }

  const value = useMemo(() => {
    const [_, width, height] = size?.match(SIZE) ?? [];
    return {
      width: Math.max(Math.min(Math.floor(+width), MAX_SIZE), MIN_SIZE),
      height: Math.max(Math.min(Math.floor(+height), MAX_SIZE), MIN_SIZE),
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
