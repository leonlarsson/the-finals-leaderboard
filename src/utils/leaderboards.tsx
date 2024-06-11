import { ShieldIcon, TerminalSquareIcon } from "lucide-react";
import openBetaData from "../data/openbeta/data.json";
import closedBeta2Data from "../data/closedbeta2/data.json";
import closedBeta1Data from "../data/closedbeta1/data.json";
import eventPlatformPushData from "../data/events/leaderboard-event-platform-push.json";
import { User } from "@/types";

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
    fetchData: async () => closedBeta1Data,
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
    fetchData: async () => closedBeta2Data,
    tableColumns: ["rank", "change", "name", "cashouts", "fame"],
  },

  openBeta: {
    type: "regular",
    id: "openBeta",
    enabled: true,
    name: "Open Beta",
    nameShort: "OB",
    disableLeagueFilter: false,
    disablePlatformSelection: true,
    disableStatsPanel: false,
    fetchData: async () => openBetaData,
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
    fetchData: async (platform: string) => {
      const res = await fetch(
        `https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}-discovery-live.json`,
      );
      return res.json();
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
    fetchData: async (platform: string) => {
      const res = await fetch(
        `https://storage.googleapis.com/embark-discovery-leaderboard/s2-leaderboard-${platform}-discovery-live.json`,
      );
      return res.json();
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season3: {
    type: "regular",
    id: "season3",
    enabled: false,
    name: "Season 3",
    nameShort: "S3",
    disableLeagueFilter: false,
    disablePlatformSelection: false,
    disableStatsPanel: false,
    fetchData: async (platform: string) => {
      // TODO: Update URL. Own API or Embark?
      const res = await fetch(
        `https://storage.googleapis.com/embark-discovery-leaderboard/s3-leaderboard-${platform}-discovery-live.json`,
      );
      return res.json();
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  platformPushEvent: {
    type: "event",
    id: "platformPushEvent",
    enabled: true,
    archived: true,
    name: "Event: Platform Push",
    nameShort: "PP",
    tabIcon: <TerminalSquareIcon size={16} />,
    disableStatsPanel: true,
    disablePlatformSelection: true,
    disableLeagueFilter: true,
    fetchData: async () => eventPlatformPushData.entries,
    tableColumns: ["rank", "name", "distance"],
  },

  terminalAttackEliminations: {
    type: "event",
    id: "terminalAttackEliminations",
    enabled: true,
    archived: true,
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
    enabled: true,
    name: "Event: 2.10",
    nameShort: "E:2.10",
    tabIcon: <ShieldIcon size={16} />,
    disableStatsPanel: true,
    disablePlatformSelection: true,
    disableLeagueFilter: true,
    fetchData: async () => {
      const res = await fetch(
        "https://the-finals-api.ragnarok.workers.dev/210event",
      );
      return (await res.json()).entries;
    },
    tableColumns: ["rank", "name", "damageDone"],
  },

  terminalAttack: {
    type: "mode",
    id: "terminalAttack",
    enabled: true,
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
  archived?: boolean;
  name: string;
  nameShort: string;
  tabIcon?: JSX.Element;
  tableColumns: (keyof User)[];
  disablePlatformSelection: boolean;
  disableStatsPanel: boolean;
  disableLeagueFilter: boolean;
  fetchData: (platform: string) => Promise<any>;
};

export type LeaderboardId = keyof typeof leaderboards;

export const defaultLeaderboardId: LeaderboardId = "season2";
