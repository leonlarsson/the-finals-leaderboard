import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClubApiClub } from "@/utils/clubApi";
import { LeaderboardId } from "@/utils/leaderboards";
import { ClubLeaderboardRanksView } from "./ClubLeaderboardRanksView";
import { ClubSeasonRanksView } from "./ClubSeasonRanksView";
import { PlayerRanksView } from "./clubSearch";
import { currentSeason } from "./clubSeason";

type ClubPlayerRanksTabProps = {
  club: ClubApiClub;
  clubTag: string;
  /** Leaderboards the club has members on, in `leaderboards` order */
  memberLbIds: LeaderboardId[];
  /** The current season's leaderboards out of `memberLbIds` */
  seasonLbIds: LeaderboardId[];
  /** The leaderboard shown in the "By leaderboard" view */
  memberLbId: LeaderboardId | undefined;
  view: PlayerRanksView;
  onSelectView: (view: PlayerRanksView) => void;
  onSelectLeaderboard: (id: LeaderboardId) => void;
};

/** Where the club's members rank: all current season leaderboards at once, or one leaderboard in full */
export const ClubPlayerRanksTab = ({
  club,
  clubTag,
  memberLbIds,
  seasonLbIds,
  memberLbId,
  view,
  onSelectView,
  onSelectLeaderboard,
}: ClubPlayerRanksTabProps) => {
  return (
    <div className="space-y-3">
      {/* Same switch style as the platform selection on the main page */}
      <Tabs
        className="select-none"
        value={view}
        onValueChange={(value) => onSelectView(value as PlayerRanksView)}
      >
        <TabsList className="h-9">
          <TabsTrigger value="season">{currentSeason}</TabsTrigger>
          <TabsTrigger value="leaderboard">By leaderboard</TabsTrigger>
        </TabsList>
      </Tabs>

      {view === "season" ? (
        <ClubSeasonRanksView clubTag={clubTag} seasonLbIds={seasonLbIds} />
      ) : (
        <ClubLeaderboardRanksView
          club={club}
          clubTag={clubTag}
          memberLbIds={memberLbIds}
          memberLbId={memberLbId}
          onSelectLeaderboard={onSelectLeaderboard}
        />
      )}
    </div>
  );
};
