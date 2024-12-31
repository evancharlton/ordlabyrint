import { useCallback, useEffect, useState } from "react";
import { MdHelpOutline } from "react-icons/md";
import { Link, Outlet, useLocation } from "react-router";
import classes from "./Page.module.css";
import { HeaderBarItem, PageContext } from "./context";

const comparator = (
  { weight: a }: HeaderBarItem,
  { weight: b }: HeaderBarItem
) => {
  return a - b;
};

export const Page = () => {
  const [headerItems, setHeaderItems] = useState<HeaderBarItem[]>([]);

  const addHeaderItem = useCallback((item: HeaderBarItem) => {
    setHeaderItems((old) =>
      old
        .filter(({ id }) => id !== item.id)
        .concat(item)
        .sort(comparator)
    );
  }, []);

  const location = useLocation();
  useEffect(() => {
    setHeaderItems([]);
  }, [location]);

  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <h1>
          <Link to="/">Ordlabyrint</Link>
        </h1>
        <div className={classes.buttons}>
          <button>
            <MdHelpOutline />
          </button>
          {headerItems.map(({ item }) => item)}
        </div>
      </div>
      <div className={classes.content}>
        <PageContext.Provider value={{ addHeaderItem }}>
          <Outlet />
        </PageContext.Provider>
      </div>
    </div>
  );
};
