import { useEffect, useState } from "react";
import { LeaderboardId } from "@/utils/leaderboards";

const STORAGE_KEY = "leaderboard-favorites";

export function useLeaderboardFavorites() {
  const [leaderboardFavorites, setLeaderboardFavorites] = useState<
    LeaderboardId[]
  >(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leaderboardFavorites));
  }, [leaderboardFavorites]);

  const isLeaderboardFavorite = (id: LeaderboardId) =>
    leaderboardFavorites.includes(id);

  const toggleLeaderboardFavorite = (id: LeaderboardId) => {
    setLeaderboardFavorites((prev) =>
      isLeaderboardFavorite(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const clearLeaderboardFavorites = () => setLeaderboardFavorites([]);

  return {
    leaderboardFavorites,
    isLeaderboardFavorite,
    toggleLeaderboardFavorite,
    clearLeaderboardFavorites,
  };
}
