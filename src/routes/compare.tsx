import { panels } from "@/types";
import type { BaseUserWithExtras } from "@/types";
import { AutocompleteInput } from "@/components/AutocompleteInput";
import { DataFreshnessNote } from "@/components/DataFreshnessNote";
import LeagueImage from "@/components/LeagueImage";
import { SponsorImage } from "@/components/SponsorImage";
import { Button } from "@/components/ui/button";
import {
  apiIdToWebId,
  getSeasonGroup,
  Leaderboard,
  LeaderboardId,
  leaderboards,
  seasonOrder,
} from "@/utils/leaderboards";
import {
  ClubApiClub,
  ClubApiLeaderboardEntry,
  fetchClub,
  searchClubs,
} from "@/utils/clubApi";
import {
  fetchPlayer,
  PlayerApiResponse,
  searchPlayers,
} from "@/utils/playerApi";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  ChevronDown,
  ChevronUp,
  Minus,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

enum CompareMode {
  Players = "players",
  Clubs = "clubs",
}

const searchSchema = z.object({
  players: z.string().array().optional(),
  clubs: z.string().array().optional(),
  mode: z.enum(CompareMode).optional(),
});

export const Route = createFileRoute("/compare")({
  validateSearch: (search) => searchSchema.parse(search),
  component: RouteComponent,
});

type PlatformMatch = { platform: "steam" | "xbox" | "psn"; value: string };

const platformMatchLabels: Record<PlatformMatch["platform"], string> = {
  steam: "Steam",
  xbox: "Xbox",
  psn: "PlayStation",
};

// platformMatch is only set when the query matched a linked Steam/Xbox/PSN name instead of the Embark name.
type PlayerSuggestion = {
  name: string;
  clubTag?: string;
  platformMatch?: PlatformMatch;
};

const fetchPlayerSuggestions = async (
  query: string,
  signal: AbortSignal,
): Promise<PlayerSuggestion[]> => {
  const entries = await searchPlayers(query, { signal });
  const lowerQuery = query.toLowerCase();

  type Candidate = PlayerSuggestion & { updatedAt: string; score: number };

  // Keep the most recently updated row per name so the suggestion reflects the player's current club.
  const byName = new Map<string, Candidate>();
  for (const entry of entries) {
    const user = entry as unknown as BaseUserWithExtras;
    if (!user.name) continue;
    const key = user.name.toLowerCase();
    const updatedAt = user.updatedAt ?? "";

    const nameMatches = key.includes(lowerQuery);
    let platformMatch: PlatformMatch | undefined;
    if (!nameMatches) {
      const platformNames: [PlatformMatch["platform"], string | undefined][] = [
        ["steam", user.steamName],
        ["xbox", user.xboxName],
        ["psn", user.psnName],
      ];
      const match = platformNames.find(
        ([, value]) => value && value.toLowerCase().includes(lowerQuery),
      );
      if (match) platformMatch = { platform: match[0], value: match[1]! };
    }

    const score = key.startsWith(lowerQuery)
      ? 0
      : platformMatch?.value.toLowerCase().startsWith(lowerQuery)
        ? 1
        : nameMatches
          ? 2
          : 3;

    const existing = byName.get(key);
    if (!existing || updatedAt > existing.updatedAt) {
      byName.set(key, {
        name: user.name,
        clubTag: user.clubTag,
        platformMatch,
        updatedAt,
        score,
      });
    }
  }

  return Array.from(byName.values())
    .sort((a, b) => a.score - b.score || b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 8)
    .map(({ name, clubTag, platformMatch }) => ({
      name,
      clubTag,
      platformMatch,
    }));
};

const renderPlayerSuggestion = (item: PlayerSuggestion) => (
  <span className="flex min-w-0 flex-col">
    <span className="flex items-center gap-1.5">
      <span className="truncate" title={item.name}>
        {item.name}
      </span>

      {item.clubTag && (
        <span className="shrink-0 text-neutral-400">[{item.clubTag}]</span>
      )}
    </span>

    {item.platformMatch && (
      <span
        className="truncate text-xs text-neutral-400"
        title={`via ${platformMatchLabels[item.platformMatch.platform]}: ${item.platformMatch.value}`}
      >
        via {platformMatchLabels[item.platformMatch.platform]}:{" "}
        {item.platformMatch.value}
      </span>
    )}
  </span>
);

type ClubSuggestion = { clubTag: string; memberCount: number };

const fetchClubSuggestions = async (
  query: string,
  signal: AbortSignal,
): Promise<ClubSuggestion[]> => {
  // searchClubs only returns members when withMembers is true, needed here for memberCount.
  const clubs = await searchClubs(query, { withMembers: true, signal });
  return clubs
    .slice(0, 8)
    .map((c) => ({ clubTag: c.clubTag, memberCount: c.members.length }));
};

function RouteComponent() {
  const {
    players = [],
    clubs = [],
    mode = CompareMode.Players,
  } = Route.useSearch();
  const navigate = useNavigate();
  const isClubMode = mode === CompareMode.Clubs;

  const [playerInputs, setPlayerInputs] = useState<[string, string]>([
    players[0] ?? "",
    players[1] ?? "",
  ]);
  const [clubInputs, setClubInputs] = useState<[string, string]>([
    clubs[0] ?? "",
    clubs[1] ?? "",
  ]);

  const player1 = players[0];
  const player2 = players[1];
  const club1Tag = clubs[0];
  const club2Tag = clubs[1];

  useEffect(() => {
    const title = isClubMode
      ? club1Tag && club2Tag
        ? `[${club1Tag}] vs [${club2Tag}] · Enhanced Leaderboard – THE FINALS`
        : "Compare Clubs · Enhanced Leaderboard – THE FINALS"
      : player1 && player2
        ? `${player1} vs ${player2} · Enhanced Leaderboard – THE FINALS`
        : "Compare Players · Enhanced Leaderboard – THE FINALS";
    document.title = title;
    return () => {
      document.title = "Enhanced Leaderboard – THE FINALS";
    };
  }, [isClubMode, player1, player2, club1Tag, club2Tag]);

  const player1Query = useQuery({
    queryKey: ["player", player1],
    queryFn: ({ signal }) => fetchPlayer(player1!, { signal }),
    staleTime: Infinity,
    enabled: !isClubMode && Boolean(player1),
  });
  const player2Query = useQuery({
    queryKey: ["player", player2],
    queryFn: ({ signal }) => fetchPlayer(player2!, { signal }),
    staleTime: Infinity,
    enabled: !isClubMode && Boolean(player2),
  });

  const isLoading =
    !isClubMode &&
    ((Boolean(player1) && player1Query.isLoading) ||
      (Boolean(player2) && player2Query.isLoading));

  const club1Query = useQuery({
    queryKey: ["club", club1Tag],
    queryFn: ({ signal }) =>
      fetchClub(club1Tag!, { withMembers: true, signal }),
    staleTime: Infinity,
    enabled: isClubMode && Boolean(club1Tag),
  });
  const club2Query = useQuery({
    queryKey: ["club", club2Tag],
    queryFn: ({ signal }) =>
      fetchClub(club2Tag!, { withMembers: true, signal }),
    staleTime: Infinity,
    enabled: isClubMode && Boolean(club2Tag),
  });

  const isLoadingClubs =
    isClubMode &&
    ((Boolean(club1Tag) && club1Query.isLoading) ||
      (Boolean(club2Tag) && club2Query.isLoading));

  const handleComparePlayers = () => {
    const trimmed = playerInputs.map((s) => s.trim()).filter(Boolean);
    navigate({
      to: "/compare",
      search: { players: trimmed.length ? trimmed : undefined },
    });
  };

  const handleCompareClubs = () => {
    const trimmed = clubInputs.map((s) => s.trim()).filter(Boolean);
    navigate({
      to: "/compare",
      search: {
        clubs: trimmed.length ? trimmed : undefined,
        mode: CompareMode.Clubs,
      },
    });
  };

  const switchMode = (nextMode: CompareMode) => {
    navigate({
      to: "/compare",
      search: {
        mode: nextMode === CompareMode.Players ? undefined : nextMode,
      },
    });
  };

  const player1Data = player1Query.data;
  const player2Data = player2Query.data;

  const getPlayerEntry = (
    data: PlayerApiResponse | null | undefined,
    webId: string,
  ) =>
    data?.leaderboards.find((l) => apiIdToWebId(l.leaderboardId) === webId) as
      | BaseUserWithExtras
      | undefined;

  const relevantLbIds = player1
    ? Array.from(
        new Set([
          ...(player1Data?.leaderboards.map((l) =>
            apiIdToWebId(l.leaderboardId),
          ) ?? []),
          ...(player2Data?.leaderboards.map((l) =>
            apiIdToWebId(l.leaderboardId),
          ) ?? []),
        ]),
      ).filter(
        (webId) =>
          (leaderboards[webId as LeaderboardId] as Leaderboard | undefined)
            ?.enabled,
      )
    : [];

  const grouped = new Map<string, string[]>();
  for (const webId of relevantLbIds) {
    const group = getSeasonGroup(webId);
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group)!.push(webId);
  }
  const sortedGroups = [...grouped.entries()].sort(
    ([a], [b]) => seasonOrder.indexOf(a) - seasonOrder.indexOf(b),
  );

  const club1 = club1Query.data;
  const club2 = club2Query.data;

  const getClubEntry = (club: ClubApiClub | null | undefined, webId: string) =>
    club?.leaderboards.find((l) => apiIdToWebId(l.leaderboardId) === webId);

  const relevantClubLbIds = club1Tag
    ? Array.from(
        new Set([
          ...(club1?.leaderboards.map((l) => apiIdToWebId(l.leaderboardId)) ??
            []),
          ...(club2?.leaderboards.map((l) => apiIdToWebId(l.leaderboardId)) ??
            []),
        ]),
      )
    : [];

  const clubGrouped = new Map<string, string[]>();
  for (const webId of relevantClubLbIds) {
    const group = getSeasonGroup(webId);
    if (!clubGrouped.has(group)) clubGrouped.set(group, []);
    clubGrouped.get(group)!.push(webId);
  }
  const clubSortedGroups = [...clubGrouped.entries()].sort(
    ([a], [b]) => seasonOrder.indexOf(a) - seasonOrder.indexOf(b),
  );

  return (
    <div className="my-4 flex flex-col gap-6">
      <Link
        to="/"
        className="flex w-fit items-center gap-1 font-medium hover:underline"
      >
        <ArrowLeftIcon size={20} /> Back to leaderboards
      </Link>

      <div>
        <div className="mb-3 flex w-fit rounded-md border border-neutral-200 p-0.5 text-sm dark:border-neutral-800">
          <button
            onClick={() => switchMode(CompareMode.Players)}
            className={`rounded px-2.5 py-1 font-medium transition-colors ${
              !isClubMode
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            Players
          </button>

          <button
            onClick={() => switchMode(CompareMode.Clubs)}
            className={`rounded px-2.5 py-1 font-medium transition-colors ${
              isClubMode
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            Clubs
          </button>
        </div>

        <div className="mb-1 text-2xl font-medium">
          {isClubMode ? "Compare Clubs" : "Compare Players"}
        </div>

        <div className="mb-4">
          <DataFreshnessNote />
        </div>

        {!isClubMode ? (
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-500">
                Player 1
              </label>

              <AutocompleteInput
                value={playerInputs[0]}
                onChange={(v) => setPlayerInputs((prev) => [v, prev[1]])}
                onSelect={(item) =>
                  setPlayerInputs((prev) => [item.name, prev[1]])
                }
                onEnter={handleComparePlayers}
                placeholder="Name#1234"
                className="w-52"
                queryKeyPrefix="compare-player-search"
                fetchItems={fetchPlayerSuggestions}
                getKey={(item) => item.name}
                getLabel={(item) => item.name}
                renderItem={renderPlayerSuggestion}
              />
            </div>

            <span className="pb-[9px] text-sm font-medium text-neutral-400">
              vs
            </span>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-500">
                Player 2
              </label>

              <AutocompleteInput
                value={playerInputs[1]}
                onChange={(v) => setPlayerInputs((prev) => [prev[0], v])}
                onSelect={(item) =>
                  setPlayerInputs((prev) => [prev[0], item.name])
                }
                onEnter={handleComparePlayers}
                placeholder="Name#1234"
                className="w-52"
                queryKeyPrefix="compare-player-search"
                fetchItems={fetchPlayerSuggestions}
                getKey={(item) => item.name}
                getLabel={(item) => item.name}
                renderItem={renderPlayerSuggestion}
              />
            </div>

            <Button onClick={handleComparePlayers}>Compare</Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-500">
                Club 1
              </label>

              <AutocompleteInput
                value={clubInputs[0]}
                onChange={(v) => setClubInputs((prev) => [v, prev[1]])}
                onSelect={(item) =>
                  setClubInputs((prev) => [item.clubTag, prev[1]])
                }
                onEnter={handleCompareClubs}
                placeholder="Club tag"
                className="w-52"
                queryKeyPrefix="compare-club-search"
                fetchItems={fetchClubSuggestions}
                getKey={(item) => item.clubTag}
                getLabel={(item) => item.clubTag}
                renderItem={(item) => (
                  <span className="flex items-center gap-1.5">
                    <span>[{item.clubTag}]</span>

                    <span className="text-neutral-400">
                      {item.memberCount} member
                      {item.memberCount === 1 ? "" : "s"}
                    </span>
                  </span>
                )}
              />
            </div>

            <span className="pb-[9px] text-sm font-medium text-neutral-400">
              vs
            </span>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-500">
                Club 2
              </label>

              <AutocompleteInput
                value={clubInputs[1]}
                onChange={(v) => setClubInputs((prev) => [prev[0], v])}
                onSelect={(item) =>
                  setClubInputs((prev) => [prev[0], item.clubTag])
                }
                onEnter={handleCompareClubs}
                placeholder="Club tag"
                className="w-52"
                queryKeyPrefix="compare-club-search"
                fetchItems={fetchClubSuggestions}
                getKey={(item) => item.clubTag}
                getLabel={(item) => item.clubTag}
                renderItem={(item) => (
                  <span className="flex items-center gap-1.5">
                    <span>[{item.clubTag}]</span>

                    <span className="text-neutral-400">
                      {item.memberCount} member
                      {item.memberCount === 1 ? "" : "s"}
                    </span>
                  </span>
                )}
              />
            </div>

            <Button onClick={handleCompareClubs}>Compare</Button>
          </div>
        )}
      </div>

      {!isClubMode && player1 && player2 && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-[1fr_1fr_1fr] items-center gap-4 border-b border-neutral-200 pb-3 dark:border-neutral-800">
            <PlayerNameChip
              name={player1}
              notFound={!player1Query.isLoading && player1Data === null}
            />

            <span className="text-center text-xs font-medium uppercase tracking-wider text-neutral-400">
              Leaderboard
            </span>

            <div className="flex justify-end">
              <PlayerNameChip
                name={player2}
                notFound={!player2Query.isLoading && player2Data === null}
              />
            </div>
          </div>

          {isLoading && (
            <p className="text-sm text-neutral-500">Loading data...</p>
          )}

          {!isLoading && sortedGroups.length === 0 && (
            <p className="text-neutral-500">
              Neither player was found in the top 10K of any leaderboard.
            </p>
          )}

          {sortedGroups.map(([season, webIds]) => (
            <div key={season}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {season}
              </div>

              <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-sm">
                  <tbody>
                    {webIds.map((webId, lbLocalIdx) => {
                      const lb = leaderboards[
                        webId as LeaderboardId
                      ] as Leaderboard;
                      const u1 = getPlayerEntry(player1Data, webId);
                      const u2 = getPlayerEntry(player2Data, webId);
                      return (
                        <ComparisonRow
                          key={webId}
                          lb={lb}
                          u1={u1}
                          u2={u2}
                          isLast={lbLocalIdx === webIds.length - 1}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isClubMode && player1 && !player2 && !isLoading && (
        <p className="text-sm text-neutral-500">
          Enter a second player name above and click Compare.
        </p>
      )}

      {isClubMode && club1Tag && club2Tag && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-[1fr_1fr_1fr] items-center gap-4 border-b border-neutral-200 pb-3 dark:border-neutral-800">
            <ClubNameChip
              clubTag={club1Tag}
              notFound={!club1Query.isLoading && club1 === null}
            />

            <span className="text-center text-xs font-medium uppercase tracking-wider text-neutral-400">
              Leaderboard
            </span>

            <div className="flex justify-end">
              <ClubNameChip
                clubTag={club2Tag}
                notFound={!club2Query.isLoading && club2 === null}
              />
            </div>
          </div>

          {isLoadingClubs && (
            <p className="text-sm text-neutral-500">Loading data...</p>
          )}

          {!isLoadingClubs && clubSortedGroups.length === 0 && (
            <p className="text-neutral-500">
              Neither club was found in the top 10K of any leaderboard.
            </p>
          )}

          {clubSortedGroups.map(([season, webIds]) => (
            <div key={season}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {season}
              </div>

              <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-sm">
                  <tbody>
                    {webIds.map((webId, idx) => (
                      <ClubComparisonRow
                        key={webId}
                        webId={webId}
                        entry1={getClubEntry(club1, webId)}
                        entry2={getClubEntry(club2, webId)}
                        isLast={idx === webIds.length - 1}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {isClubMode && club1Tag && !club2Tag && !isLoadingClubs && (
        <p className="text-sm text-neutral-500">
          Enter a second club tag above and click Compare.
        </p>
      )}
    </div>
  );
}

const PlayerNameChip = ({
  name,
  notFound,
}: {
  name: string;
  notFound?: boolean;
}) => {
  const [base, tag] = name.split("#");
  return (
    <div className="flex flex-col gap-0.5">
      <Link
        to="/players/$playerName"
        params={{ playerName: name }}
        className="flex w-fit items-center gap-1.5 font-medium hover:underline"
      >
        <UserRoundIcon className="size-4 shrink-0 text-neutral-400" />

        <span>{base}</span>

        {tag && <span className="text-neutral-400">#{tag}</span>}
      </Link>

      {notFound && (
        <span className="text-xs text-red-500">Player not found</span>
      )}
    </div>
  );
};

const ClubNameChip = ({
  clubTag,
  notFound,
}: {
  clubTag: string;
  notFound?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-0.5">
      <Link
        to="/clubs/$clubTag"
        params={{ clubTag }}
        className="flex w-fit items-center gap-1.5 font-medium hover:underline"
      >
        <UsersRoundIcon className="size-4 shrink-0 text-neutral-400" />

        <span>[{clubTag}]</span>
      </Link>

      {notFound && <span className="text-xs text-red-500">Club not found</span>}
    </div>
  );
};

const ClubComparisonRow = ({
  webId,
  entry1,
  entry2,
  isLast,
}: {
  webId: string;
  entry1: ClubApiLeaderboardEntry | undefined;
  entry2: ClubApiLeaderboardEntry | undefined;
  isLast: boolean;
}) => {
  const lb = leaderboards[webId as LeaderboardId] as Leaderboard | undefined;
  const name = lb?.name ?? webId;

  return (
    <tr
      className={`grid grid-cols-[1fr_auto_1fr] items-center ${!isLast ? "border-b border-neutral-200 dark:border-neutral-800" : ""}`}
    >
      <td className="px-4 py-3">
        <ClubStat entry={entry1} />
      </td>

      <td className="px-4 py-3 text-center">
        {lb ? (
          <Link
            to="/"
            search={{ lb: webId as LeaderboardId, panel: panels.CLUBS }}
            className="text-xs font-medium text-neutral-500 hover:underline"
          >
            {name}
          </Link>
        ) : (
          <span className="text-xs font-medium text-neutral-500">{name}</span>
        )}
      </td>

      <td className="px-4 py-3 text-right">
        <ClubStat entry={entry2} align="right" />
      </td>
    </tr>
  );
};

const ClubStat = ({
  entry,
  align = "left",
}: {
  entry: ClubApiLeaderboardEntry | undefined;
  align?: "left" | "right";
}) => {
  const side = align === "right" ? "items-end" : "items-start";

  if (!entry)
    return (
      <div className={`flex flex-col ${side}`}>
        <span className="text-sm text-neutral-400">—</span>
      </div>
    );

  return (
    <div className={`flex flex-col gap-0.5 ${side}`}>
      <span className="font-semibold">
        #{entry.clubRank.toLocaleString("en")}
      </span>

      <span className="text-xs text-neutral-500">
        {entry.totalValue.toLocaleString("en")} pts
      </span>

      <span className="text-xs text-neutral-500">
        {entry.memberCount.toLocaleString("en")} member
        {entry.memberCount === 1 ? "" : "s"}
      </span>
    </div>
  );
};

const ComparisonRow = ({
  lb,
  u1,
  u2,
  isLast,
}: {
  lb: Leaderboard;
  u1: BaseUserWithExtras | undefined;
  u2: BaseUserWithExtras | undefined;
  isLast: boolean;
}) => {
  return (
    <tr
      className={`grid grid-cols-[1fr_auto_1fr] items-center ${!isLast ? "border-b border-neutral-200 dark:border-neutral-800" : ""}`}
    >
      <td className="px-4 py-3">
        <PlayerStat user={u1} lb={lb} />
      </td>

      <td className="px-4 py-3 text-center">
        <Link
          to="/"
          search={{ lb: lb.id as LeaderboardId, panel: panels.LEADERBOARD }}
          className="text-xs font-medium text-neutral-500 hover:underline"
        >
          {lb.name}
        </Link>
      </td>

      <td className="px-4 py-3 text-right">
        <PlayerStat user={u2} lb={lb} align="right" />
      </td>
    </tr>
  );
};

const PlayerStat = ({
  user,
  lb,
  align = "left",
}: {
  user: BaseUserWithExtras | undefined;
  lb: Leaderboard;
  align?: "left" | "right";
}) => {
  const cols = lb.tableColumns;
  const side = align === "right" ? "items-end" : "items-start";

  if (!user)
    return (
      <div className={`flex flex-col ${side}`}>
        <span className="text-sm text-neutral-400">—</span>
      </div>
    );

  return (
    <div className={`flex flex-col gap-0.5 ${side}`}>
      <span className="font-semibold">#{user.rank.toLocaleString("en")}</span>

      {cols.includes("change") && <RankChange change={user.change} />}

      {cols.includes("fame") && user.league && (
        <div className="flex items-center gap-1">
          <LeagueImage league={user.league} size={14} />
          <span className="text-xs text-neutral-500">{user.league}</span>
        </div>
      )}

      {cols.includes("fame") &&
        (user.fame !== undefined || user.rankScore !== undefined) && (
          <span className="text-xs text-neutral-500">
            {(user.fame ?? user.rankScore ?? 0).toLocaleString("en")}{" "}
            {user.rankScore !== undefined ? "RS" : "fame"}
          </span>
        )}

      {cols.includes("fans") && user.sponsor && (
        <div className="flex items-center gap-1">
          <SponsorImage sponsor={user.sponsor} size={14} useIcon />

          <span className="text-xs text-neutral-500">
            {(user.fans ?? 0).toLocaleString("en")} fans
          </span>
        </div>
      )}

      {!cols.includes("fame") &&
        cols.includes("cashouts") &&
        user.cashouts !== undefined && (
          <span className="text-xs text-neutral-500">
            {user.cashouts.toLocaleString("en", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </span>
        )}

      {!cols.includes("fame") &&
        !cols.includes("cashouts") &&
        cols.includes("points") &&
        user.points !== undefined && (
          <span className="text-xs text-neutral-500">
            {user.points.toLocaleString("en")} pts
          </span>
        )}
    </div>
  );
};

const RankChange = ({ change }: { change: number }) => {
  if (change > 0)
    return (
      <span className="inline-flex items-center text-xs text-indigo-400 dark:text-indigo-300">
        <ChevronUp className="size-3" />
        {change.toLocaleString("en")}
      </span>
    );

  if (change < 0)
    return (
      <span className="inline-flex items-center text-xs text-red-500">
        <ChevronDown className="size-3" />
        {Math.abs(change).toLocaleString("en")}
      </span>
    );

  return (
    <span className="inline-flex items-center text-xs text-neutral-500">
      <Minus className="size-3" />0
    </span>
  );
};
