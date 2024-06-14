import { ShieldIcon, TerminalSquareIcon } from "lucide-react";
import type { BaseUser, BaseUserWithExtras } from "@/types";

export const leaderboards = {
  closedBeta1: {
    type: "regular",
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
    type: "regular",
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
    type: "regular",
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
    type: "regular",
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
    type: "regular",
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
    type: "regular",
    id: "season3",
    enabled: true,
    name: "Season 3",
    nameShort: "S3",
    disableLeagueFilter: false,
    disablePlatformSelection: true,
    disableStatsPanel: false,
    hidePlatformNameInStatsPanel: true,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s3/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season3WorldTour: {
    type: "event",
    id: "season3WorldTour",
    enabled: true,
    name: "World Tour",
    nameShort: "WT",
    disableLeagueFilter: true,
    disablePlatformSelection: true,
    disableStatsPanel: true,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/s3worldtour",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "cashouts"],
  },

  terminalAttackEliminations: {
    type: "event",
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

  communityEvent210: {
    type: "event",
    id: "communityEvent210",
    enabled: false,
    name: "Event: 2.10",
    nameShort: "E:2.10",
    tabIcon: <ShieldIcon size={16} />,
    disableStatsPanel: true,
    disablePlatformSelection: true,
    disableLeagueFilter: true,
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/210event",
      );
      return (await res.json()).entries;
    },
    transformData: data =>
      data.map(x => ({
        rank: x.r,
        name: x.name,
        damageDone: x.c,
        steamName: x.steam,
        xboxName: x.xbox,
        psnName: x.psn,
      })),
    tableColumns: ["rank", "name", "damageDone"],
  },

  terminalAttack: {
    type: "mode",
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
} satisfies Record<string, Leaderboard>;

export type Leaderboard = {
  type: "regular" | "mode" | "event";
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
