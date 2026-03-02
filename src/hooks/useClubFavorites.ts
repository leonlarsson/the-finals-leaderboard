import { useEffect, useState } from "react";

const STORAGE_KEY = "club-favorites";

export function useClubFavorites() {
  const [clubFavorites, setClubFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clubFavorites));
  }, [clubFavorites]);

  const isClubFavorite = (tag: string) =>
    clubFavorites.some((f) => f.toLowerCase() === tag.toLowerCase());

  const toggleClubFavorite = (tag: string) => {
    setClubFavorites((prev) =>
      isClubFavorite(tag)
        ? prev.filter((f) => f.toLowerCase() !== tag.toLowerCase())
        : [...prev, tag],
    );
  };

  return { clubFavorites, isClubFavorite, toggleClubFavorite };
}
