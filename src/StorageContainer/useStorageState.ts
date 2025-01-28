import localforage from "localforage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const StorageContext = createContext<
  { get: (instance: string) => LocalForage } | undefined
>(undefined);

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("Must be used inside of <StorageContext.Provider .. />!");
  }
  return context;
};

export const globalStore = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: "ordlabyrint",
  version: 1,
  storeName: "ordlabyrint",
});

type DataState = "loading" | "loaded" | "updating";

const useStorageDataInternal = <TValue>(
  key: string,
  defaultValue: NonNullable<TValue>,
) => {
  const [data, setData] = useState<NonNullable<TValue>>(defaultValue);
  const [state, setState] = useState<DataState>("loading");

  const load = useCallback(() => {
    setState("loading");
    globalStore
      .getItem<TValue | null>(key)
      .then((d) => {
        if (d) {
          setData(d);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setState("loaded");
      });
  }, [key]);

  useEffect(() => {
    load();

    addEventListener("storage", load);
    return () => {
      removeEventListener("storage", load);
    };
  }, [load]);

  return { data, state, setData, setState };
};

export const useStorageData = <TValue>(
  key: string,
  defaultValue: NonNullable<TValue>,
) => {
  const { data, state } = useStorageDataInternal<TValue>(key, defaultValue);
  return { data, state };
};

const markDirty = () =>
  localStorage.setItem(`ordlabyrint/dirty`, new Date().toISOString());

export const useStorageState = <TValue>(
  key: string,
  defaultValue: NonNullable<TValue>,
) => {
  const { data, setData, state, setState } = useStorageDataInternal<TValue>(
    key,
    defaultValue,
  );

  const defaultValueRef = useRef(defaultValue);
  const update: typeof setData = useCallback(
    (dataOrUpdater) => {
      let nextValue: TValue;
      if (typeof dataOrUpdater === "function") {
        nextValue = (dataOrUpdater as (prevState: TValue) => TValue)(data);
      } else {
        nextValue = dataOrUpdater;
      }

      setState("updating");
      const update =
        nextValue === null || nextValue === undefined
          ? globalStore.removeItem(key)
          : globalStore.setItem<TValue>(key, nextValue);

      update.finally(() => {
        setData(nextValue ?? defaultValueRef.current);
        setState("loaded");
        markDirty();
      });
    },
    [data, key, setData, setState],
  );

  return [data, update, state] as const;
};
