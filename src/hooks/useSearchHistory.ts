import { useState } from "react";

const STORAGE_KEY = "tfl-search-history";
const MAX_ENTRIES = 8;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  const addToHistory = (name: string) => {
    if (!name.trim()) return;
    setHistory((prev) => {
      const filtered = prev.filter(
        (n) => n.toLowerCase() !== name.toLowerCase(),
      );
      const updated = [name, ...filtered].slice(0, MAX_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromHistory = (name: string) => {
    setHistory((prev) => {
      const updated = prev.filter(
        (n) => n.toLowerCase() !== name.toLowerCase(),
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { history, addToHistory, removeFromHistory };
}
