import noStoreFetch from "./noStoreFetch";

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

  september2024CommunityEvent314: {
    name: "Community Event 3.14",
    active: true,
    type: "grenadeDetonations",
    initialGoal: 30_000_000,
    fetchData: async () => {
      const res = await noStoreFetch(
        "https://api.the-finals-leaderboard.com/proxy?url=https://id.embark.games/leaderboards/ce314",
      );

      const text = await res.text();
      const stringData = text.match(
        /<script id="__NEXT_DATA__" type="application\/json">(.*)<\/script>/,
      )?.[1];

      if (!stringData) {
        throw new Error("Failed to fetch data");
      }

      const data = JSON.parse(stringData);

      return {
        entries: data.props.pageProps.entries,
        progress: {
          goal: data.props.pageProps.progress.goal,
          current: data.props.pageProps.progress.currentProgress,
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
    | "grenadeDetonations";
  initialGoal: number;
  fetchData: () => Promise<{
    entries: any[];
    progress: {
      goal: number;
      current: number;
    };
  }>;
};
