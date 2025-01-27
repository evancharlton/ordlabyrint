import { createContext, useContext } from "react";

export const FavoritesContext = createContext<
  | {
      favorites: Record<string, number>;
      toggle: () => void;
      isFavorite: boolean;
    }
  | undefined
>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("Must be used within <FavoritesContext.Provider .. />");
  }
  return context;
};
