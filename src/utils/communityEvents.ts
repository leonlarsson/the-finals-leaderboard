export const communityEvents = {
  november2024Ce44: {
    name: "Community Event 4.8",
    active: true,
    type: "cashoutsStolen",
    initialGoal: 600_000,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/community-event/ce48",
      );
      const json = await res.json();
      return {
        entries: json.data.entries,
        progress: {
          goal: json.data.progress.goal,
          current: json.data.progress.currentProgress,
        },
      };
    },
  },
} satisfies Record<string, CommunityEvent>;

export type CommunityEvent = {
  name: string;
  active: boolean;
  type:
    | "cash"
    | "distance"
    | "eliminations"
    | "damage"
    | "roundsPlayed"
    | "grenadeDetonations"
    | "cashoutsStolen";
  initialGoal: number;
  fetchData: () => Promise<{
    entries: any[];
    progress: {
      goal: number;
      current: number;
    };
  }>;
};
