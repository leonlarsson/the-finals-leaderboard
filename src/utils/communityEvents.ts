export const communityEvents = {
  february2024Cachouts: {
    name: "Cashouts",
    type: "cash",
    initialGoal: 250_000_000_000,
    apiUrl:
      "https://storage.googleapis.com/embark-discovery-leaderboard/community-event-leaderboard-discovery-live.json",
  },
  april2024PushThePlatform: {
    name: "Push the Platform",
    type: "distance",
    initialGoal: 400_750,
    apiUrl:
      "https://storage.googleapis.com/embark-discovery-leaderboard/platform-push-event-leaderboard-discovery-live.json",
  },
  may2024TerminalAttackEliminations: {
    name: "Terminal Attack Eliminations",
    type: "eliminations",
    initialGoal: 7_000_000,
    apiUrl:
      "https://storage.googleapis.com/embark-discovery-leaderboard/community-event-2-8-leaderboard-discovery-live.json",
  },
  may2024CommunityEvent210: {
    name: "Community Event 2.10",
    type: "damage",
    initialGoal: 18_000_000_000,
    apiUrl: "https://the-finals-api.ragnarok.workers.dev/210event",
    goalDataPath: "progress.goal",
    currentDataPath: "progress.current",
  },
} satisfies Record<string, CommunityEvent>;

export type CommunityEvent = {
  name: string;
  type: "cash" | "distance" | "eliminations" | "damage";
  initialGoal: number;
  apiUrl: string;
  /** Where in the json the goal data is located. */
  goalDataPath?: string;
  /** Where in the json the current data is located. */
  currentDataPath?: string;
};
