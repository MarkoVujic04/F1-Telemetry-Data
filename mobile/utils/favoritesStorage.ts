import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Favorite, FavoritesList } from "@/utils/favorites";

const STORAGE_KEY = "@f1_favorites";

export function createFavoriteId(year: number, circuitName: string, session: string) {
  return `${year}-${circuitName}-${session}`;
}

export async function loadFavorites(): Promise<FavoritesList> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("loadFavorites failed", e);
    return [];
  }
}

export async function saveFavorites(favorites: FavoritesList): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error("saveFavorites failed", e);
  }
}

export async function addFavorite(year: number, circuitName: string, session: string): Promise<FavoritesList> {
  const favorites = await loadFavorites();
  const id = createFavoriteId(year, circuitName, session);

  if (favorites.some((f) => f.id === id)) return favorites; 

  const next: FavoritesList = [
    { id, year, circuitName, session, addedAt: Date.now() },
    ...favorites,
  ];

  await saveFavorites(next);
  return next;
}

export async function removeFavorite(id: string): Promise<FavoritesList> {
  const favorites = await loadFavorites();
  const next = favorites.filter((f) => f.id !== id);
  await saveFavorites(next);
  return next;
}

export function isFavorited(favorites: FavoritesList, year: number, circuitName: string, session: string) {
  const id = createFavoriteId(year, circuitName, session);
  return favorites.some((f) => f.id === id);
}
