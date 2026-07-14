const API_BASE = "https://api.the-finals-leaderboard.com";

export type PlayerApiEntry = {
  leaderboardId: string;
  platform: string | null;
  updatedAt: string;
} & Record<string, unknown>;

export type PlayerApiResponse = {
  name: string;
  displayName: string;
  discriminator: string | null;
  leaderboards: PlayerApiEntry[];
};

export const fetchPlayer = async (
  name: string,
  options?: { signal?: AbortSignal },
): Promise<PlayerApiResponse | null> => {
  const res = await fetch(`${API_BASE}/v1/player/${encodeURIComponent(name)}`, {
    signal: options?.signal,
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch player");
  return res.json();
};

export const searchPlayers = async (
  query: string,
  options?: {
    leaderboardIds?: string[];
    platforms?: string[];
    exactMatch?: boolean;
    signal?: AbortSignal;
  },
): Promise<PlayerApiEntry[]> => {
  const params = new URLSearchParams({ q: query });
  if (options?.leaderboardIds?.length) {
    params.set("leaderboards", options.leaderboardIds.join(","));
  }
  if (options?.platforms?.length) {
    params.set("platforms", options.platforms.join(","));
  }
  if (options?.exactMatch) {
    params.set("exactMatch", "true");
  }

  const res = await fetch(`${API_BASE}/v1/players?${params}`, {
    signal: options?.signal,
  });
  if (!res.ok) throw new Error("Failed to search players");
  const data = (await res.json()) as { entries: PlayerApiEntry[] };
  return data.entries;
};
