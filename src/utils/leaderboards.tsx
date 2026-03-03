import type { BaseUser, BaseUserWithExtras, LeaderboardFeature } from "@/types";
import { ReactNode } from "react";

export const leaderboards = {
  // Season 9
  season9: {
    group: "select1",
    id: "season9",
    enabled: true,
    name: "Season 9",
    nameShort: "S9",
    features: [
      "statsPanel",
      "clubsPanel",
      "leagueFilter",
      "statsPanelMovers",
    ] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s9/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "change", "name", "fame"],
  },

  season9Sponsor: {
    group: "select1",
    id: "season9Sponsor",
    enabled: true,
    name: "Season 9 Sponsor",
    nameShort: "S9S",
    features: ["statsPanel", "clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s9sponsor/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "sponsor", "fans"],
  },

  season9WorldTour: {
    group: "select1",
    id: "season9WorldTour",
    enabled: true,
    name: "Season 9 World Tour",
    nameShort: "S9WT",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s9worldtour/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "cashouts"],
  },

  season9Head2Head: {
    group: "select1",
    id: "season9Head2Head",
    enabled: true,
    name: "Season 9 Head2Head",
    nameShort: "S9H2H",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s9head2head/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season9PowerShift: {
    group: "select1",
    id: "season9PowerShift",
    enabled: true,
    name: "Season 9 PowerShift",
    nameShort: "S9PS",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s9powershift/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season9QuickCash: {
    group: "select1",
    id: "season9QuickCash",
    enabled: true,
    name: "Season 9 Quick Cash",
    nameShort: "S9QC",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s9quickcash/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season9TeamDeathmatch: {
    group: "select1",
    id: "season9TeamDeathmatch",
    enabled: true,
    name: "Season 9 Team Deathmatch",
    nameShort: "S9BI",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s9teamdeathmatch/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season9PointBreak: {
    group: "select1",
    id: "season9PointBreak",
    enabled: true,
    name: "Season 9 Point Break",
    nameShort: "S9PB",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s9pointbreak/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  // Season 8
  season8: {
    group: "select2",
    id: "season8",
    enabled: true,
    name: "Season 8",
    nameShort: "S8",
    features: [
      "statsPanel",
      "clubsPanel",
      "leagueFilter",
      "statsPanelMovers",
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
    group: "select2",
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
    group: "select2",
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
    group: "select2",
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
    group: "select2",
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
    group: "select2",
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
    group: "select2",
    id: "season8TeamDeathmatch",
    enabled: true,
    name: "Season 8 Team Deathmatch",
    nameShort: "S8TDM",
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
    group: "select2",
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

  season8GhoulRush: {
    group: "select2",
    id: "season8GhoulRush",
    enabled: true,
    name: "Season 8 Ghoul Rush",
    nameShort: "S8GR",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s8ghoulrush/crossplay",
      );
      const data = await res.json();
      return data.data as BaseUser[];
    },
    tableColumns: ["rank", "name", "points"],
  },

  season8BlastOff: {
    group: "select2",
    id: "season8BlastOff",
    enabled: true,
    name: "Season 8 Blast Off",
    nameShort: "S8BO",
    features: ["clubsPanel"] as LeaderboardFeature[],
    fetchData: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/v1/leaderboard/s8blastoff/crossplay",
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
      "statsPanelMovers",
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
    nameShort: "S7TDM",
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
      "statsPanelMovers",
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
    nameShort: "S6TDM",
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
    nameShort: "S6HH",
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
      "statsPanelMovers",
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
    features: [
      "statsPanel",
      "leagueFilter",
      "statsPanelMovers",
    ] as LeaderboardFeature[],
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
    features: [
      "statsPanel",
      "leagueFilter",
      "statsPanelMovers",
    ] as LeaderboardFeature[],
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
    features: [
      "statsPanel",
      "leagueFilter",
      "statsPanelMovers",
    ] as LeaderboardFeature[],
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
      "statsPanelMovers",
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
      "statsPanelMovers",
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
      "statsPanelMovers",
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
    features: [
      "statsPanel",
      "leagueFilter",
      "statsPanelMovers",
    ] as LeaderboardFeature[],
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
    features: [
      "statsPanel",
      "leagueFilter",
      "statsPanelMovers",
    ] as LeaderboardFeature[],
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

export const defaultLeaderboardId: LeaderboardId = "season9";
export const defaultLeaderboard = leaderboards[defaultLeaderboardId];
export const leaderboardIdsToPrefetch: LeaderboardId[] = [
  "season9",
  "season9Sponsor",
  "season9WorldTour",
  "season9Head2Head",
  "season9PowerShift",
  "season9QuickCash",
  "season9TeamDeathmatch",
  "season9PointBreak",
];

// Maps short API leaderboard IDs (e.g. "s9") to web IDs (e.g. "season9").
// Used when displaying club leaderboard standings from the clubs API.
export const apiIdToWebId = (id: string): string =>
  (
    ({
      s9: "season9",
      s9sponsor: "season9Sponsor",
      s9worldtour: "season9WorldTour",
      s9head2head: "season9Head2Head",
      s9powershift: "season9PowerShift",
      s9quickcash: "season9QuickCash",
      s9teamdeathmatch: "season9TeamDeathmatch",
      s9pointbreak: "season9PointBreak",
      s8: "season8",
      s8sponsor: "season8Sponsor",
      s8worldtour: "season8WorldTour",
      s8head2head: "season8Head2Head",
      s8powershift: "season8PowerShift",
      s8quickcash: "season8QuickCash",
      s8teamdeathmatch: "season8TeamDeathmatch",
      s8heavenorelse: "season8HeavenOrElse",
      s8ghoulrush: "season8GhoulRush",
      s8blastoff: "season8BlastOff",
      s7: "season7",
      s7sponsor: "season7Sponsor",
      s7worldtour: "season7WorldTour",
      s7terminalattack: "season7TerminalAttack",
      s7powershift: "season7PowerShift",
      s7quickcash: "season7QuickCash",
      s7teamdeathmatch: "season7TeamDeathmatch",
      s7blastoff: "season7BlastOff",
      s7cashball: "season7CashBall",
      s6: "season6",
      s6sponsor: "season6Sponsor",
      s6worldtour: "season6WorldTour",
      s6terminalattack: "season6TerminalAttack",
      s6powershift: "season6PowerShift",
      s6quickcash: "season6QuickCash",
      s6teamdeathmatch: "season6TeamDeathmatch",
      s6heavyhitters: "season6HeavyHitters",
      s5: "season5",
      s5sponsor: "season5Sponsor",
      s5worldtour: "season5WorldTour",
      s5terminalattack: "season5TerminalAttack",
      s5powershift: "season5PowerShift",
      s5quickcash: "season5QuickCash",
      s5bankit: "season5BankIt",
    }) as Record<string, string>
  )[id] ?? id;

export const getSeasonGroup = (id: string): string => {
  if (id.startsWith("season9")) return "Season 9";
  if (id.startsWith("season8")) return "Season 8";
  if (id.startsWith("season7")) return "Season 7";
  if (id.startsWith("season6")) return "Season 6";
  if (id.startsWith("season5")) return "Season 5";
  if (id.startsWith("season4")) return "Season 4";
  if (id.startsWith("season3")) return "Season 3";
  if (id.startsWith("season2")) return "Season 2";
  if (id.startsWith("season1")) return "Season 1";
  if (id.startsWith("openBeta")) return "Open Beta";
  if (id.startsWith("closedBeta")) return "Closed Beta";
  return "Other";
};

export const seasonOrder = [
  "Season 9",
  "Season 8",
  "Season 7",
  "Season 6",
  "Season 5",
  "Season 4",
  "Season 3",
  "Season 2",
  "Season 1",
  "Open Beta",
  "Closed Beta",
  "Other",
];
