import { useMemo } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import { GridSizeContext } from "./context";

const SIZE = /^([\d]+)x([\d]+)$/;
const MAX_SIZE = 10;

export const GridSizeProvider = () => {
  const navigate = useNavigate();
  const { size } = useParams();
  if (!size) {
    throw new Error("React router misconfigured");
  }

  if (!SIZE.test(size)) {
    navigate("..");
    return;
  }

  const value = useMemo(() => {
    const [_, width, height] = size.match(SIZE) ?? [];
    return {
      width: Math.min(+width, MAX_SIZE),
      height: Math.min(+height, MAX_SIZE),
    };
  }, [size]);
  return (
    <GridSizeContext.Provider value={value}>
      <Outlet />
    </GridSizeContext.Provider>
  );
};
