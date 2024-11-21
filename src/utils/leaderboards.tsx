import type { BaseUser, BaseUserWithExtras } from "@/types";

export const leaderboards = {
  ce48: {
    group: 0,
    id: "ce48",
    enabled: true,
    name: "Community Event 4.8",
    nameShort: "CE48",
    disableLeagueFilter: true,
    disablePlatformSelection: true,
    disableStatsPanel: true,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/community-event/ce48",
      );
      const json = await res.json();
      return json.data.entries as BaseUser[];
    },
    tableColumns: ["rank", "name", "score"],
  },

  season4: {
    group: 1,
    id: "season4",
    enabled: true,
    name: "Season 4",
    nameShort: "S4",
    disableLeagueFilter: false,
    disablePlatformSelection: true,
    disableStatsPanel: false,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s4/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season4WorldTour: {
    group: 1,
    id: "season4WorldTour",
    enabled: true,
    name: "S4 World Tour",
    nameShort: "S4WT",
    disableLeagueFilter: true,
    disablePlatformSelection: true,
    disableStatsPanel: true,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s4worldtour/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "cashouts"],
  },

  season4Sponsor: {
    group: 1,
    id: "season4Sponsor",
    enabled: true,
    name: "S4 Sponsor",
    nameShort: "S4S",
    disableLeagueFilter: true,
    disablePlatformSelection: true,
    disableStatsPanel: false,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s4sponsor/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "sponsor", "fans"],
  },

  season3: {
    group: 2,
    id: "season3",
    enabled: true,
    name: "Season 3",
    nameShort: "S3",
    disableLeagueFilter: false,
    disablePlatformSelection: true,
    disableStatsPanel: false,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s3/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season3Original: {
    group: 2,
    id: "season3Original",
    enabled: true,
    name: "Season 3 - Original",
    nameShort: "S3OR",
    disableLeagueFilter: false,
    disablePlatformSelection: true,
    disableStatsPanel: false,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s3original/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season3WorldTour: {
    group: 2,
    id: "season3WorldTour",
    enabled: true,
    name: "Season 3 World Tour",
    nameShort: "S3WT",
    disableLeagueFilter: true,
    disablePlatformSelection: true,
    disableStatsPanel: true,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s3worldtour/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "cashouts"],
  },

  season3TheFinals: {
    group: 2,
    id: "season3TheFinals",
    enabled: true,
    name: "Season 3 The Finals",
    nameShort: "S3TF",
    disableLeagueFilter: true,
    disablePlatformSelection: true,
    disableStatsPanel: true,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/the-finals/crossplay",
      );
      const data = await res.json();
      return data.data;
    },
    tableColumns: ["rank", "name", "tournamentWins"],
  },

  season2: {
    group: 2,
    id: "season2",
    enabled: true,
    name: "Season 2",
    nameShort: "S2",
    disableLeagueFilter: false,
    disablePlatformSelection: false,
    disableStatsPanel: false,
    fetchData: async platform => {
      const res = await fetch(
        `https://api.the-finals-leaderboard.com/v1/leaderboard/s2/${platform}`,
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season1: {
    group: 2,
    id: "season1",
    enabled: true,
    name: "Season 1",
    nameShort: "S1",
    disableLeagueFilter: false,
    disablePlatformSelection: false,
    disableStatsPanel: false,
    fetchData: async platform => {
      const res = await fetch(
        `https://api.the-finals-leaderboard.com/v1/leaderboard/s1/${platform}`,
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "cashouts", "fame"],
  },

  openBeta: {
    group: 2,
    id: "openBeta",
    enabled: true,
    name: "Open Beta",
    nameShort: "OB",
    disableLeagueFilter: false,
    disablePlatformSelection: false,
    disableStatsPanel: false,
    fetchData: async platform => {
      const res = await fetch(
        `https://api.the-finals-leaderboard.com/v1/leaderboard/ob/${platform}`,
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "cashouts", "fame"],
  },

  closedBeta2: {
    group: 2,
    enabled: true,
    id: "closedBeta2",
    name: "Closed Beta 2",
    nameShort: "CB2",
    disableLeagueFilter: false,
    disablePlatformSelection: true,
    disableStatsPanel: false,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/cb2",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "cashouts", "fame"],
  },

  closedBeta1: {
    group: 2,
    enabled: true,
    id: "closedBeta1",
    name: "Closed Beta 1",
    nameShort: "CB1",
    disableLeagueFilter: false,
    disablePlatformSelection: true,
    disableStatsPanel: false,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/cb1",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "xp", "level", "cashouts", "fame"],
  },

  ce44: {
    group: 2,
    id: "ce44",
    enabled: true,
    name: "Community Event 4.4",
    nameShort: "CE44",
    disableLeagueFilter: true,
    disablePlatformSelection: true,
    disableStatsPanel: true,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/community-event/ce44",
      );
      const json = await res.json();
      return json.data.entries as BaseUser[];
    },
    tableColumns: ["rank", "name", "score"],
  },
} satisfies Record<string, Leaderboard>;

export type Leaderboard = {
  group: number;
  id: string;
  enabled: boolean;
  name: string;
  nameShort: string;
  tabIcon?: JSX.Element;
  tableColumns: (keyof BaseUserWithExtras)[];
  disablePlatformSelection: boolean;
  disableStatsPanel: boolean;
  disableLeagueFilter: boolean;
  fetchData: (platform: string) => Promise<any>;
  transformData?: (data: any[]) => any[];
};

export type LeaderboardId = keyof typeof leaderboards;

export const defaultLeaderboardId: LeaderboardId = "season4";
export const leaderboardIdsToPrefetch: LeaderboardId[] = [
  "ce48",
  "season4",
  "season4WorldTour",
  "season4Sponsor",
];
