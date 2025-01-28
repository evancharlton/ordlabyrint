import { useCallback } from "react";
import { useParams } from "react-router";
import { useBoardId } from "../BoardIdProvider";
import { useGridSize } from "../GridSizeProvider";
import { useStorageState } from "../StorageContainer";
import { FavoritesContext } from "./context";
import { ButtonsPortal } from "../Page";
import { MdStar, MdStarOutline } from "react-icons/md";

export type FavoritesData = Record<string, number>;

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { lang } = useParams();
  const { key: sizeKey } = useGridSize();
  const { id } = useBoardId();

  const [favorites, setFavorites] = useStorageState<FavoritesData>(
    `${lang}/${sizeKey}/favorites`,
    {},
  );

  const toggle = useCallback(() => {
    setFavorites((value) => {
      if (value[id]) {
        const copy = { ...value };
        delete copy[id];
        return copy;
      }

      return {
        ...value,
        [id]: Date.now(),
      };
    });
  }, [id, setFavorites]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggle, isFavorite: !!favorites[id] }}
    >
      {children}
      <ButtonsPortal>
        <button onClick={() => toggle()} style={{ order: 1 }}>
          {favorites[id] ? <MdStar /> : <MdStarOutline />}
        </button>
      </ButtonsPortal>
    </FavoritesContext.Provider>
  );
};
