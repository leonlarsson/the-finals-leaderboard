const API_BASE = "https://api.the-finals-leaderboard.com";

export type ClubApiLeaderboardEntry = {
  leaderboardId: string;
  totalValue: number;
  memberCount: number;
  clubRank: number;
  updatedAt: string;
};

export type ClubApiClub = {
  clubTag: string;
  members: { name: string }[];
  leaderboards: ClubApiLeaderboardEntry[];
};

export const fetchClub = async (
  clubTag: string,
  options?: { withMembers?: boolean; signal?: AbortSignal },
): Promise<ClubApiClub | null> => {
  const params = new URLSearchParams();
  if (options?.withMembers) params.set("withMembers", "true");

  const res = await fetch(
    `${API_BASE}/v1/club/${encodeURIComponent(clubTag)}?${params}`,
    { signal: options?.signal },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch club");
  return res.json();
};

export const searchClubs = async (
  query: string,
  options?: {
    leaderboardIds?: string[];
    exactMatch?: boolean;
    withMembers?: boolean;
    signal?: AbortSignal;
  },
): Promise<ClubApiClub[]> => {
  const params = new URLSearchParams({ q: query });
  if (options?.leaderboardIds?.length) {
    params.set("leaderboards", options.leaderboardIds.join(","));
  }
  if (options?.exactMatch) {
    params.set("exactMatch", "true");
  }
  if (options?.withMembers) {
    params.set("withMembers", "true");
  }

  const res = await fetch(`${API_BASE}/v1/clubs?${params}`, {
    signal: options?.signal,
  });
  if (!res.ok) throw new Error("Failed to search clubs");
  const data = (await res.json()) as { clubs: ClubApiClub[] };
  return data.clubs;
};
