import { LeaderboardId } from "@/utils/leaderboards";

/** The first tab is the default one and is left out of the URL */
export const clubTabs = [
  "club-rank",
  "player-ranks",
  "stats",
  "roster",
] as const;

export type ClubTab = (typeof clubTabs)[number];

/** Rows per page of the member tables, kept apart from the main leaderboard's setting */
export const CLUB_MEMBERS_PAGE_SIZE_KEY = "tfl-club-members-page-size";

/** The two views of the Player ranks tab. The first is the default one */
export const playerRanksViews = ["season", "leaderboard"] as const;

export type PlayerRanksView = (typeof playerRanksViews)[number];

/** Search params of the club page, used for links back into it */
export type ClubSearch = {
  tab?: ClubTab;
  view?: PlayerRanksView;
  lb?: LeaderboardId;
};
