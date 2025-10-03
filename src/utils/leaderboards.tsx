import type { BaseUser, BaseUserWithExtras, LeaderboardFeature } from "@/types";
import { ReactNode } from "react";

export const leaderboards = {
  // Season 8
  season8: {
    group: "select1",
    id: "season8",
    enabled: true,
    name: "Season 8",
    nameShort: "S8",
    features: [
      "statsPanel",
      "clubsPanel",
      "leagueFilter",
    ] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s8/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season8Sponsor: {
    group: "select1",
    id: "season8Sponsor",
    enabled: true,
    name: "Season 8 Sponsor",
    nameShort: "S8S",
    features: ["statsPanel", "clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s8sponsor/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "sponsor", "fans"],
  },

  season8WorldTour: {
    group: "select1",
    id: "season8WorldTour",
    enabled: true,
    name: "Season 8 World Tour",
    nameShort: "S8WT",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s8worldtour/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "cashouts"],
  },

  season8Head2Head: {
    group: "select1",
    id: "season8Head2Head",
    enabled: true,
    name: "Season 8 Head2Head",
    nameShort: "S8H2H",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s8head2head/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season8PowerShift: {
    group: "select1",
    id: "season8PowerShift",
    enabled: true,
    name: "Season 8 PowerShift",
    nameShort: "S8PS",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s8powershift/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season8QuickCash: {
    group: "select1",
    id: "season8QuickCash",
    enabled: true,
    name: "Season 8 Quick Cash",
    nameShort: "S8QC",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s8quickcash/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season8TeamDeathmatch: {
    group: "select1",
    id: "season8TeamDeathmatch",
    enabled: true,
    name: "Season 8 Team Deathmatch",
    nameShort: "S5BI",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s8teamdeathmatch/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season8HeavenOrElse: {
    group: "select1",
    id: "season8HeavenOrElse",
    enabled: true,
    name: "Season 8 Heaven Or Else",
    nameShort: "S8HE",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s8heavenorelse/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  // Season 7
  season7: {
    group: "select2",
    id: "season7",
    enabled: true,
    name: "Season 7",
    nameShort: "S7",
    features: [
      "statsPanel",
      "clubsPanel",
      "leagueFilter",
    ] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s7/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season7Sponsor: {
    group: "select2",
    id: "season7Sponsor",
    enabled: true,
    name: "Season 7 Sponsor",
    nameShort: "S7S",
    features: ["statsPanel", "clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s7sponsor/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "sponsor", "fans"],
  },

  season7WorldTour: {
    group: "select2",
    id: "season7WorldTour",
    enabled: true,
    name: "Season 7 World Tour",
    nameShort: "S7WT",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s7worldtour/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "cashouts"],
  },

  season7TerminalAttack: {
    group: "select2",
    id: "season7TerminalAttack",
    enabled: true,
    name: "Season 7 Terminal Attack",
    nameShort: "S7TA",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s7terminalattack/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season7PowerShift: {
    group: "select2",
    id: "season7PowerShift",
    enabled: true,
    name: "Season 7 PowerShift",
    nameShort: "S7PS",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s7powershift/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season7QuickCash: {
    group: "select2",
    id: "season7QuickCash",
    enabled: true,
    name: "Season 7 Quick Cash",
    nameShort: "S7QC",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s7quickcash/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season7TeamDeathmatch: {
    group: "select2",
    id: "season7TeamDeathmatch",
    enabled: true,
    name: "Season 7 Team Deathmatch",
    nameShort: "S5BI",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s7teamdeathmatch/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season7BlastOff: {
    group: "select2",
    id: "season7BlastOff",
    enabled: true,
    name: "Season 7 Blast Off",
    nameShort: "S7BO",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s7blastoff/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season7CashBall: {
    group: "select2",
    id: "season7CashBall",
    enabled: true,
    name: "Season 7 Cash Ball",
    nameShort: "S7CB",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s7cashball/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  // Season 6
  season6: {
    group: "select2",
    id: "season6",
    enabled: true,
    name: "Season 6",
    nameShort: "S6",
    features: [
      "statsPanel",
      "clubsPanel",
      "leagueFilter",
    ] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s6/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season6Sponsor: {
    group: "select2",
    id: "season6Sponsor",
    enabled: true,
    name: "Season 6 Sponsor",
    nameShort: "S6S",
    features: ["statsPanel", "clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s6sponsor/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "sponsor", "fans"],
  },

  season6WorldTour: {
    group: "select2",
    id: "season6WorldTour",
    enabled: true,
    name: "Season 6 World Tour",
    nameShort: "S6WT",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s6worldtour/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "cashouts"],
  },

  season6TerminalAttack: {
    group: "select2",
    id: "season6TerminalAttack",
    enabled: true,
    name: "Season 6 Terminal Attack",
    nameShort: "S6TA",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s6terminalattack/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season6PowerShift: {
    group: "select2",
    id: "season6PowerShift",
    enabled: true,
    name: "Season 6 PowerShift",
    nameShort: "S6PS",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s6powershift/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season6QuickCash: {
    group: "select2",
    id: "season6QuickCash",
    enabled: true,
    name: "Season 6 Quick Cash",
    nameShort: "S6QC",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s6quickcash/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season6TeamDeathmatch: {
    group: "select2",
    id: "season6TeamDeathmatch",
    enabled: true,
    name: "Season 6 Team Deathmatch",
    nameShort: "S5BI",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s6teamdeathmatch/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season6HeavyHitters: {
    group: "select2",
    id: "season6HeavyHitters",
    enabled: true,
    name: "Season 6 Heavy Hitters",
    nameShort: "S5HH",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s6heavyhitters/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  // Season 5
  season5: {
    group: "select2",
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
    group: "select2",
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
    group: "select2",
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
    group: "select2",
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
    group: "select2",
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
    group: "select2",
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
    group: "select2",
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

  // Season 4
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

  // Season 3
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

  // Season 2
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

  // Season 1
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

  // Open Beta
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

  // Closed Beta 2
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

  // Closed Beta 1
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

  // ÖRF
  orf: {
    group: "select1",
    id: "orf",
    enabled: true,
    name: "ÖRF",
    nameShort: "ÖRF",
    features: [] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/orf/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "score"],
  },

  // Community Events
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

export const defaultLeaderboardId: LeaderboardId = "season8";
export const leaderboardIdsToPrefetch: LeaderboardId[] = [
  "season8",
  "season8Sponsor",
  "season8WorldTour",
  "season8Head2Head",
  "season8PowerShift",
  "season8QuickCash",
  "season8TeamDeathmatch",
  "season8HeavenOrElse",
];
