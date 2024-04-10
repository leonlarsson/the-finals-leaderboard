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
} satisfies Record<string, CommunityEvent>;

export type CommunityEvent = {
  name: string;
  type: "cash" | "distance";
  initialGoal: number;
  apiUrl: string;
};
