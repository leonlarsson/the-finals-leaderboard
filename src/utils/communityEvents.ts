export const communityEvents = {
  february2024Cachouts: {
    name: "Cashouts",
    active: false,
    type: "cash",
    initialGoal: 250_000_000_000,
    fetchData: async () => {
      const res = await fetch(
        "https://storage.googleapis.com/embark-discovery-leaderboard/community-event-leaderboard-discovery-live.json",
      );
      const data = await res.json();
      return {
        entries: data.entries,
        progress: {
          goal: data.goal,
          current: data.total,
        },
      };
    },
  },
  april2024PushThePlatform: {
    name: "Push the Platform",
    active: false,
    type: "distance",
    initialGoal: 400_750,
    fetchData: async () => {
      const res = await fetch(
        "https://storage.googleapis.com/embark-discovery-leaderboard/platform-push-event-leaderboard-discovery-live.json",
      );
      const data = await res.json();
      return {
        entries: data.entries,
        progress: {
          goal: data.goal,
          current: data.total,
        },
      };
    },
  },
  may2024TerminalAttackEliminations: {
    name: "Terminal Attack Eliminations",
    active: false,
    type: "eliminations",
    initialGoal: 7_000_000,
    fetchData: async () => {
      const res = await fetch(
        "https://storage.googleapis.com/embark-discovery-leaderboard/community-event-2-8-leaderboard-discovery-live.json",
      );
      const data = await res.json();
      return {
        entries: data.entries,
        progress: {
          goal: data.goal,
          current: data.total,
        },
      };
    },
  },
  may2024CommunityEvent210: {
    name: "Community Event 2.10",
    active: false,
    type: "damage",
    initialGoal: 18_000_000_000,
    fetchData: async () => {
      const res = await fetch(
        "https://the-finals-api.ragnarok.workers.dev/210event",
      );
      const data = await res.json();
      return {
        entries: data.entries,
        progress: {
          goal: data.progress.goal,
          current: data.progress.current,
        },
      };
    },
  },
} satisfies Record<string, CommunityEvent>;

export type CommunityEvent = {
  name: string;
  active: boolean;
  type: "cash" | "distance" | "eliminations" | "damage";
  initialGoal: number;
  fetchData: () => Promise<{
    entries: any[];
    progress: {
      goal: number;
      current: number;
    };
  }>;
};
