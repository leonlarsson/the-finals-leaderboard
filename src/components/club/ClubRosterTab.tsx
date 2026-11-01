import { Link } from "@tanstack/react-router";
import { UsersRoundIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ClubApiClub } from "@/utils/clubApi";
import { splitPlayerName } from "@/utils/playerName";
import { ClubEmptyState } from "./ClubEmptyState";

type ClubRosterTabProps = {
  club: ClubApiClub;
};

/** Everyone in the club, A-Z. Ranks are on the Player ranks tab */
export const ClubRosterTab = ({ club }: ClubRosterTabProps) => {
  const [playersFilter, setPlayersFilter] = useState("");

  const filteredMembers = club.members
    .filter((member) =>
      member.name.toLowerCase().includes(playersFilter.trim().toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-neutral-500">
        Everyone who has been in the top 10K of a leaderboard while in this
        club, in any season.
      </p>
      {club.members.length > 0 && (
        <Input
          type="search"
          placeholder="Filter members..."
          className="max-w-xs"
          value={playersFilter}
          onChange={(e) => setPlayersFilter(e.target.value)}
        />
      )}
      {club.members.length === 0 ? (
        <ClubEmptyState
          icon={UsersRoundIcon}
          title="No members"
          description="Nobody in this club has been in the top 10K of a leaderboard."
        />
      ) : filteredMembers.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No members match &ldquo;{playersFilter}&rdquo;.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.map((member) => {
            const { name, tag } = splitPlayerName(member.name);
            return (
              <Link
                key={member.name}
                to="/players/$playerName"
                params={{ playerName: member.name }}
                title={member.name}
                className="flex min-w-0 items-center gap-1 rounded-lg border border-neutral-200 px-3 py-2.5 text-sm font-medium transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
              >
                <span className="truncate">{name}</span>
                {tag !== undefined && (
                  <span className="shrink-0 font-normal text-neutral-500">
                    #{tag}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
