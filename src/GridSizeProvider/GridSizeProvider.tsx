import { useMemo } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { GridSizeContext } from "./context";

const SIZE = /^([\d]+)x([\d]+)$/;
const MAX_SIZE = 21;

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
      width: Math.min(+width, MAX_SIZE),
      height: Math.min(+height, MAX_SIZE),
    };
  }, [size]);

  if (!SIZE.test(size)) {
    navigate("..");
    return;
  }

  return (
    <GridSizeContext.Provider value={value}>
      <Outlet />
    </GridSizeContext.Provider>
  );
};
