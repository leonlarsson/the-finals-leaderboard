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
        "https://api.the-finals-leaderboard.com/210event",
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

  july2024CommunityEvent35: {
    name: "Community Event 3.5",
    active: false,
    type: "eliminations",
    initialGoal: 1_900_000,
    fetchData: async () => {
      const res = await fetch("https://api.the-finals-leaderboard.com/35event");
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

  august2024CommunityEvent311: {
    name: "Community Event 3.11",
    active: false,
    type: "roundsPlayed",
    initialGoal: 6_000_000,
    fetchData: async () => {
      const res = await fetch("https://api.the-finals-leaderboard.com/ce311");
      const data = await res.json();
      return {
        entries: data.entries,
        progress: {
          goal: data.progress.goal,
          current: data.progress.currentProgress,
        },
      };
    },
  },
} satisfies Record<string, CommunityEvent>;

export type CommunityEvent = {
  name: string;
  active: boolean;
  type: "cash" | "distance" | "eliminations" | "damage" | "roundsPlayed";
  initialGoal: number;
  fetchData: () => Promise<{
    entries: any[];
    progress: {
      goal: number;
      current: number;
    };
  }>;
};
