import { ReactNode, useEffect, useState } from "react";
import { Loader } from "../spa-components/Loader";
import { globalStore } from "./useStorageState";
import { Solution } from "../HistoryProvider";

let upgrading = false;
const APP_VERSION = 2;

export const StorageContainer = ({ children }: { children: ReactNode }) => {
  const [upgraded, setUpgraded] = useState(false);

  useEffect(() => {
    const upgrade = async () => {
      if (upgrading) {
        return;
      }

      try {
        let storedVersion =
          (await globalStore.getItem<number>("_version")) ?? 1;
        while (storedVersion < APP_VERSION)
          switch (storedVersion) {
            case 1: {
              // 1 -> 2
              const keys = await globalStore.keys();

              // We want to collapse the different keys into a single object.
              const favorites: Record<
                string /* lang/size */,
                Record<string /* id */, number>
              > = {};
              const historyObj: Record<
                string /* lang/size */,
                Record<string /* id */, Solution[]>
              > = {};
              const solutions: Record<
                string /* lang/size */,
                Record<string /* id */, Solution>
              > = {};

              let i = 0;
              keyLoop: for (const key of keys) {
                if (i++ % 100 === 0) {
                  await new Promise((resolve) => setTimeout(resolve, 0));
                }

                const favoritesMatch = key.match(
                  /favorites\/(nb|nn)\/([^/]+)$/,
                );
                if (favoritesMatch) {
                  const [_, lang, size] = favoritesMatch;
                  const value =
                    await globalStore.getItem<Record<string, number>>(key);
                  if (value) {
                    favorites[`${lang}/${size}/favorites`] = value;
                  }
                  continue keyLoop;
                }

                const historyMatch = key.match(
                  /history\/(nb|nn)\/([^/]+)\/(.+)$/,
                );
                if (historyMatch) {
                  const [_, lang, size, id] = historyMatch;
                  const value = await globalStore.getItem<Solution[]>(key);
                  if (value) {
                    const objId = `${lang}/${size}/history`;
                    historyObj[objId] = historyObj[objId] ?? {};
                    historyObj[objId] = {
                      ...historyObj[objId],
                      [id]: value,
                    };
                  }
                  continue keyLoop;
                }

                const solutionMatch = key.match(
                  /solutions\/(nb|nn)\/([^/]+)\/(.+)$/,
                );
                if (solutionMatch) {
                  const [_, lang, size, id] = solutionMatch;
                  const value = await globalStore.getItem<Solution>(key);
                  if (value) {
                    const objId = `${lang}/${size}/solutions`;
                    solutions[objId] = solutions[objId] ?? {};
                    solutions[objId] = {
                      ...solutions[objId],
                      [id]: value,
                    };
                  }
                  continue keyLoop;
                }
              }

              for (const obj of [favorites, historyObj, solutions]) {
                for (const [key, value] of Object.entries(obj)) {
                  await globalStore.setItem(key, value);
                }
              }

              storedVersion += 1;
              break;
            }
          }

        await globalStore.setItem("_version", APP_VERSION);
        setUpgraded(true);
      } finally {
        upgrading = false;
      }
    };

    upgrade();
    return () => {};
  }, []);

  if (!upgraded) {
    return <Loader text="upgrading" />;
  }

  return <>{children}</>;
};
