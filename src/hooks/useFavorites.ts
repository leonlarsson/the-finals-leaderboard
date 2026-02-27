import { useEffect, useState } from "react";

const STORAGE_KEY = "player-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (name: string) =>
    favorites.some((f) => f.toLowerCase() === name.toLowerCase());

  const toggleFavorite = (name: string) => {
    setFavorites((prev) =>
      isFavorite(name)
        ? prev.filter((f) => f.toLowerCase() !== name.toLowerCase())
        : [...prev, name],
    );
  };

  return { favorites, isFavorite, toggleFavorite };
}
