import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { FavoritesList } from "@/types/favorites";
import {
  addFavorite as addFav,
  removeFavorite as removeFav,
  isFavorited as isFav,
  loadFavorites,
  createFavoriteId,
} from "@/utils/favoritesStorage";

type Ctx = {
  favorites: FavoritesList;
  isLoading: boolean;
  addFavorite: (year: number, circuitName: string, session: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  toggleFavorite: (year: number, circuitName: string, session: string) => Promise<void>;
  isFavorited: (year: number, circuitName: string, session: string) => boolean;
  refreshFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<Ctx | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritesList>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const list = await loadFavorites();
      setFavorites(list);
      setIsLoading(false);
    })();
  }, []);

  const refreshFavorites = async () => {
    setIsLoading(true);
    const list = await loadFavorites();
    setFavorites(list);
    setIsLoading(false);
  };

  const addFavorite = async (year: number, circuitName: string, session: string) => {
    const next = await addFav(year, circuitName, session);
    setFavorites(next);
  };

  const removeFavorite = async (id: string) => {
    const next = await removeFav(id);
    setFavorites(next);
  };

  const toggleFavorite = async (year: number, circuitName: string, session: string) => {
    const id = createFavoriteId(year, circuitName, session);
    const exists = favorites.some((f) => f.id === id);

    if (exists) await removeFavorite(id);
    else await addFavorite(year, circuitName, session);
  };

  const isFavorited = (year: number, circuitName: string, session: string) =>
    isFav(favorites, year, circuitName, session);

  const value = useMemo(
    () => ({
      favorites,
      isLoading,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorited,
      refreshFavorites,
    }),
    [favorites, isLoading]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("favorites Error");
  return ctx;
}
