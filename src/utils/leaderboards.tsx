import { ShieldIcon, TerminalSquareIcon } from "lucide-react";
import openBetaData from "../data/leaderboard-open-beta-1.json";
import closedBeta2Data from "../data/leaderboard-closed-beta-2.json";
import closedBeta1Data from "../data/leaderboard-closed-beta-1.json";
// import eventPlatformPushData from "../data/leaderboard-event-platform-push.json";
import { User } from "@/types";

export const leaderboards = {
  closedBeta1: {
    type: "regular",
    id: "closedBeta1",
    name: "Closed Beta 1",
    nameShort: "CB1",
    disableLeagueFilter: false,
    disablePlatformSelection: true,
    disableStatsPanel: false,
    localData: closedBeta1Data,
    tableColumns: ["rank", "change", "name", "xp", "level", "cashouts", "fame"],
  },

  closedBeta2: {
    type: "regular",
    id: "closedBeta2",
    name: "Closed Beta 2",
    nameShort: "CB2",
    disableLeagueFilter: false,
    disablePlatformSelection: true,
    disableStatsPanel: false,
    localData: closedBeta2Data,
    tableColumns: ["rank", "change", "name", "cashouts", "fame"],
  },

  openBeta: {
    type: "regular",
    id: "openBeta",
    name: "Open Beta",
    nameShort: "OB",
    disableLeagueFilter: false,
    disablePlatformSelection: true,
    disableStatsPanel: false,
    localData: openBetaData,
    tableColumns: ["rank", "change", "name", "cashouts", "fame"],
  },

  season1: {
    type: "regular",
    id: "season1",
    name: "Season 1",
    nameShort: "S1",
    disableLeagueFilter: false,
    disablePlatformSelection: false,
    disableStatsPanel: false,
    apiUrl: (platform: string) =>
      `https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}-discovery-live.json`,
    tableColumns: ["rank", "change", "name", "cashouts", "fame"],
  },

  season2: {
    type: "regular",
    id: "season2",
    name: "Season 2",
    nameShort: "S2",
    disableLeagueFilter: false,
    disablePlatformSelection: false,
    disableStatsPanel: false,
    apiUrl: (platform: string) =>
      `https://storage.googleapis.com/embark-discovery-leaderboard/s2-leaderboard-${platform}-discovery-live.json`,
    tableColumns: ["rank", "change", "name", "fame"],
  },

  // Old Platform Push event. Disabled while I figure out if I want to show it
  // eventPlatformPush: {
  //   type: "event",
  //   id: "eventPlatformPush",
  //   name: "Platform Push",
  //   nameShort: "PP",
  //   tabIcon: <TerminalSquareIcon size={16} />,
  //   disableStatsPanel: true,
  //   disablePlatformSelection: true,
  //   disableLeagueFilter: true,
  //   localData: eventPlatformPushData.entries,
  //   tableColumns: ["rank", "name", "distance"],
  //   jsonDataPath: "entries",
  // },

  // eventTerminalAttackEliminations: {
  //   type: "event",
  //   id: "eventTerminalAttackEliminations",
  //   name: "Event: Terminal Attack Eliminations",
  //   nameShort: "E:TAE",
  //   tabIcon: <TerminalSquareIcon size={16} />,
  //   disableStatsPanel: true,
  //   disablePlatformSelection: true,
  //   disableLeagueFilter: true,
  //   apiUrl:
  //     "https://storage.googleapis.com/embark-discovery-leaderboard/community-event-2-8-leaderboard-discovery-live.json",
  //   jsonDataPath: "entries",
  //   tableColumns: ["rank", "name", "eliminations"],
  // },

  eventCommunityEvent210: {
    type: "event",
    id: "eventCommunityEvent210",
    name: "Event: 2.10",
    nameShort: "E:2.10",
    tabIcon: <ShieldIcon size={16} />,
    disableStatsPanel: true,
    disablePlatformSelection: true,
    disableLeagueFilter: true,
    apiUrl:
      "https://the-finals-api.ragnarok.workers.dev/proxy?url=https://id.embark.games/_next/data/VYDJeG-K6I8xvpp7W-9Ic/en/leaderboards/community-event-2-10.json?slug=community-event-2-10",
    jsonDataPath: "pageProps.entries",
    tableColumns: ["rank", "name", "damageDone"],
  },

  terminalAttack: {
    type: "event",
    id: "terminalAttack",
    name: "Terminal Attack",
    nameShort: "TA",
    tabIcon: <TerminalSquareIcon size={16} />,
    disableStatsPanel: true,
    disablePlatformSelection: true,
    disableLeagueFilter: true,
    apiUrl:
      "https://storage.googleapis.com/embark-discovery-leaderboard/terminal-attack-leaderboard-discovery-live.json",
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
  type: "regular" | "event";
  id: string;
  name: string;
  nameShort: string;
  tabIcon?: JSX.Element;
  tableColumns: (keyof User)[];
  disablePlatformSelection: boolean;
  disableStatsPanel: boolean;
  disableLeagueFilter: boolean;
  /** Where in the json the leaderboard entries array is located. It's in the root for regular leaderboards, but in "entries" for other types. */
  jsonDataPath?: string;
} & ({ apiUrl: ((platform: string) => string) | string } | { localData: any });

export type LeaderboardId = keyof typeof leaderboards;
