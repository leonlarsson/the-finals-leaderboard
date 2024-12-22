import type { BaseUser, BaseUserWithExtras, LeaderboardFeature } from "@/types";
import { ReactNode } from "react";

export const leaderboards = {
  season5: {
    group: "select1",
    id: "season5",
    enabled: true,
    name: "Season 5",
    nameShort: "S5",
    features: [
      "statsPanel",
      "clubsPanel",
      "leagueFilter",
    ] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s5/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season5Sponsor: {
    group: "select1",
    id: "season5Sponsor",
    enabled: true,
    name: "Season 5 Sponsor",
    nameShort: "S5S",
    features: ["statsPanel", "clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s5sponsor/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "sponsor", "fans"],
  },

  season5WorldTour: {
    group: "select1",
    id: "season5WorldTour",
    enabled: true,
    name: "Season 5 World Tour",
    nameShort: "S5WT",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s5worldtour/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "cashouts"],
  },

  season5TerminalAttack: {
    group: "select1",
    id: "season5TerminalAttack",
    enabled: true,
    name: "Season 5 Terminal Attack",
    nameShort: "S5TA",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s5terminalattack/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season5PowerShift: {
    group: "select1",
    id: "season5PowerShift",
    enabled: true,
    name: "Season 5 PowerShift",
    nameShort: "S5PS",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s5powershift/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season5QuickCash: {
    group: "select1",
    id: "season5QuickCash",
    enabled: true,
    name: "Season 5 Quick Cash",
    nameShort: "S5QC",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s5quickcash/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season5BankIt: {
    group: "select1",
    id: "season5BankIt",
    enabled: true,
    name: "Season 5 Bank it",
    nameShort: "S5BI",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s5bankit/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season4: {
    group: "select2",
    id: "season4",
    enabled: true,
    name: "Season 4",
    nameShort: "S4",
    features: ["statsPanel", "leagueFilter"] as LeaderboardFeature[],
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
    group: "select2",
    id: "season4WorldTour",
    enabled: true,
    name: "Season 4 World Tour",
    nameShort: "S4WT",
    features: [] as LeaderboardFeature[],
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
    group: "select2",
    id: "season4Sponsor",
    enabled: true,
    name: "Season 4 Sponsor",
    nameShort: "S4S",
    features: ["statsPanel"] as LeaderboardFeature[],
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
    group: "select2",
    id: "season3",
    enabled: true,
    name: "Season 3",
    nameShort: "S3",
    features: ["statsPanel", "leagueFilter"] as LeaderboardFeature[],
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
    group: "select2",
    id: "season3Original",
    enabled: true,
    name: "Season 3 - Original",
    nameShort: "S3OR",
    features: ["statsPanel", "leagueFilter"] as LeaderboardFeature[],
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
    group: "select2",
    id: "season3WorldTour",
    enabled: true,
    name: "Season 3 World Tour",
    nameShort: "S3WT",
    features: [] as LeaderboardFeature[],
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
    group: "select2",
    id: "season3TheFinals",
    enabled: true,
    name: "Season 3 The Finals",
    nameShort: "S3TF",
    features: [] as LeaderboardFeature[],
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
    group: "select2",
    id: "season2",
    enabled: true,
    name: "Season 2",
    nameShort: "S2",
    features: [
      "platformSelection",
      "statsPanel",
      "leagueFilter",
    ] as LeaderboardFeature[],
    fetchData: async (platform) => {
      const res = await fetch(
        `https://api.the-finals-leaderboard.com/v1/leaderboard/s2/${platform}`,
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season1: {
    group: "select2",
    id: "season1",
    enabled: true,
    name: "Season 1",
    nameShort: "S1",
    features: [
      "platformSelection",
      "statsPanel",
      "leagueFilter",
    ] as LeaderboardFeature[],
    fetchData: async (platform) => {
      const res = await fetch(
        `https://api.the-finals-leaderboard.com/v1/leaderboard/s1/${platform}`,
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "cashouts", "fame"],
  },

  openBeta: {
    group: "select2",
    id: "openBeta",
    enabled: true,
    name: "Open Beta",
    nameShort: "OB",
    features: [
      "platformSelection",
      "statsPanel",
      "leagueFilter",
    ] as LeaderboardFeature[],
    fetchData: async (platform) => {
      const res = await fetch(
        `https://api.the-finals-leaderboard.com/v1/leaderboard/ob/${platform}`,
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "cashouts", "fame"],
  },

  closedBeta2: {
    group: "select2",
    enabled: true,
    id: "closedBeta2",
    name: "Closed Beta 2",
    nameShort: "CB2",
    features: ["statsPanel", "leagueFilter"] as LeaderboardFeature[],
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
    group: "select2",
    enabled: true,
    id: "closedBeta1",
    name: "Closed Beta 1",
    nameShort: "CB1",
    features: ["statsPanel", "leagueFilter"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/cb1",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "xp", "level", "cashouts", "fame"],
  },

  ce48: {
    group: "select2",
    id: "ce48",
    enabled: true,
    name: "Community Event 4.8",
    nameShort: "CE48",
    features: [] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/community-event/ce48",
      );
      const json = await res.json();
      return json.data.entries as BaseUser[];
    },
    tableColumns: ["rank", "name", "score"],
  },

  ce44: {
    group: "select2",
    id: "ce44",
    enabled: true,
    name: "Community Event 4.4",
    nameShort: "CE44",
    features: [] as LeaderboardFeature[],
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
  group: "tabGroup1" | "tabGroup2" | "select1" | "select2";
  id: string;
  enabled: boolean;
  name: string;
  nameShort: string;
  tabIcon?: ReactNode;
  tableColumns: (keyof BaseUserWithExtras)[];
  features: LeaderboardFeature[];
  fetchData: (platform: string) => Promise<any>;
  transformData?: (data: any[]) => any[];
};

export type LeaderboardId = keyof typeof leaderboards;

export const defaultLeaderboardId: LeaderboardId = "season5";
export const leaderboardIdsToPrefetch: LeaderboardId[] = [
  "season5",
  "season5Sponsor",
  "season5WorldTour",
  "season5TerminalAttack",
  "season5PowerShift",
  "season5QuickCash",
  "season5BankIt",
];
