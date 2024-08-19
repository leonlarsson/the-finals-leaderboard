import { TerminalSquareIcon } from "lucide-react";
import type { BaseUser, BaseUserWithExtras } from "@/types";
import noStoreFetch from "./noStoreFetch";

export const leaderboards = {
  closedBeta1: {
    tabGroup: 2,
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

  closedBeta2: {
    tabGroup: 2,
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

  openBeta: {
    tabGroup: 2,
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

  season1: {
    tabGroup: 2,
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

  season2: {
    tabGroup: 2,
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

  season3: {
    tabGroup: 2,
    id: "season3",
    enabled: true,
    name: "Season 3",
    nameShort: "S3",
    disableLeagueFilter: false,
    disablePlatformSelection: true,
    disableStatsPanel: false,
    hidePlatformNameInStatsPanel: true,
    fetchData: async () => {
      const res = await noStoreFetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s3/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season3WorldTour: {
    tabGroup: 1,
    id: "season3WorldTour",
    enabled: true,
    name: "World Tour",
    nameShort: "WT",
    disableLeagueFilter: true,
    disablePlatformSelection: true,
    disableStatsPanel: true,
    fetchData: async () => {
      const res = await noStoreFetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s3worldtour/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "cashouts"],
  },

  thefinals: {
    tabGroup: 1,
    id: "thefinals",
    enabled: true,
    name: "THE FINALS",
    nameShort: "TF",
    disableLeagueFilter: true,
    disablePlatformSelection: true,
    disableStatsPanel: true,
    fetchData: async () => {
      const res = await noStoreFetch(
        "https://api.the-finals-leaderboard.com/the-finals",
      );
      return (await res.json()).entries;
    },
    transformData: data =>
      data.map(x => ({
        rank: x.r,
        name: x.name,
        tournamentWins: x.p,
        steamName: x.steam,
        xboxName: x.xbox,
        psnName: x.psn,
      })),
    tableColumns: ["rank", "name", "tournamentWins"],
  },

  terminalAttackEliminations: {
    tabGroup: 1,
    id: "terminalAttackEliminations",
    enabled: false,
    name: "Event: TA Eliminations",
    nameShort: "E:TAE",
    tabIcon: <TerminalSquareIcon size={16} />,
    disableStatsPanel: true,
    disablePlatformSelection: true,
    disableLeagueFilter: true,
    fetchData: async () => {
      const res = await fetch(
        "https://storage.googleapis.com/embark-discovery-leaderboard/community-event-2-8-leaderboard-discovery-live.json",
      );
      return (await res.json()).entries;
    },
    tableColumns: ["rank", "name", "eliminations"],
  },

  terminalAttack: {
    tabGroup: 1,
    id: "terminalAttack",
    enabled: false,
    name: "Terminal Attack",
    nameShort: "TA",
    tabIcon: <TerminalSquareIcon size={16} />,
    disableStatsPanel: true,
    disablePlatformSelection: true,
    disableLeagueFilter: true,
    fetchData: async () => {
      const res = await fetch(
        "https://storage.googleapis.com/embark-discovery-leaderboard/terminal-attack-leaderboard-discovery-live.json",
      );
      return res.json();
    },
    transformData: data =>
      data.map(x => ({
        rank: x.r,
        name: x.name,
        gamesWon: x.wg,
        roundsWon: x.wr,
        totalRounds: x.tr,
        eliminations: x.k,
        score: x.s,
        steamName: x.steam,
        xboxName: x.xbox,
        psnName: x.psn,
      })),
    tableColumns: [
      "rank",
      "name",
      "gamesWon",
      "roundsWon",
      "totalRounds",
      "eliminations",
      "score",
    ],
  },

  communityEvent35: {
    tabGroup: 1,
    id: "communityEvent35",
    enabled: false,
    name: "Community Event 3.5",
    nameShort: "CE3.5",
    disableLeagueFilter: true,
    disablePlatformSelection: true,
    disableStatsPanel: true,
    fetchData: async () => {
      const res = await noStoreFetch(
        "https://api.the-finals-leaderboard.com/35event",
      );
      return (await res.json()).entries;
    },
    transformData: data =>
      data.map(x => ({
        rank: x.r,
        name: x.name,
        eliminations: x.c,
        steamName: x.steam,
        xboxName: x.xbox,
        psnName: x.psn,
      })),
    tableColumns: ["rank", "name", "eliminations"],
  },
} satisfies Record<string, Leaderboard>;

export type Leaderboard = {
  tabGroup: number;
  id: string;
  enabled: boolean;
  name: string;
  nameShort: string;
  tabIcon?: JSX.Element;
  tableColumns: (keyof BaseUserWithExtras)[];
  disablePlatformSelection: boolean;
  disableStatsPanel: boolean;
  disableLeagueFilter: boolean;
  hidePlatformNameInStatsPanel?: boolean;
  fetchData: (platform: string) => Promise<any>;
  transformData?: (data: any[]) => any[];
};

export type LeaderboardId = keyof typeof leaderboards;

export const defaultLeaderboardId: LeaderboardId = "season3";
export const leaderboardIdsToPrefetch: LeaderboardId[] = [
  "season3",
  "season3WorldTour",
];

export const leaderboardsGroupedByTabGroup = Object.values(
  Object.groupBy(Object.values(leaderboards), x => x.tabGroup),
) as Leaderboard[][];
