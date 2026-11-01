import { Link } from "@tanstack/react-router";
import { ExternalLinkIcon, History, UsersRoundIcon } from "lucide-react";
import { useState } from "react";
import { AppBarChart } from "@/components/AppBarChart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { panels } from "@/types";
import { ClubApiClub, ClubApiLeaderboardEntry } from "@/utils/clubApi";
import {
  apiIdToWebId,
  defaultLeaderboardId,
  getSeasonGroup,
  LeaderboardId,
  leaderboards,
  seasonOrder,
} from "@/utils/leaderboards";
import { currentSeason, stripSeasonPrefix } from "./clubSeason";
import { clubRankChartScale, formatClubValue } from "./clubValue";

type ClubRankTabProps = {
  club: ClubApiClub;
  clubTag: string;
  /** Leaderboards the club has members on, linked to the Player ranks tab */
  memberLbIds: LeaderboardId[];
};

export const ClubRankTab = ({
  club,
  clubTag,
  memberLbIds,
}: ClubRankTabProps) => {
  const [standingsFilter, setStandingsFilter] = useState("");
  const [openStandingSeasons, setOpenStandingSeasons] = useState<string[]>([]);

  const rankScale = clubRankChartScale(
    club.leaderboards.map((lb) => lb.clubRank),
  );

  const filteredStandings = club.leaderboards.filter((lb) => {
    const name =
      leaderboards[apiIdToWebId(lb.leaderboardId) as LeaderboardId]?.name ??
      lb.leaderboardId;
    return name.toLowerCase().includes(standingsFilter.trim().toLowerCase());
  });

  const standingGroups = new Map<string, ClubApiLeaderboardEntry[]>();
  for (const standing of filteredStandings) {
    const season = getSeasonGroup(apiIdToWebId(standing.leaderboardId));
    if (!standingGroups.has(season)) standingGroups.set(season, []);
    standingGroups.get(season)!.push(standing);
  }
  const currentStandings = standingGroups.get(currentSeason) ?? [];
  const previousStandingGroups = Array.from(standingGroups.entries())
    .filter(([season]) => season !== currentSeason)
    .sort(([a], [b]) => seasonOrder.indexOf(a) - seasonOrder.indexOf(b));

  return (
    <div className="flex flex-col gap-6">
      {club.leaderboards.length >= 2 && (
        <div className="rounded-md bg-neutral-100 p-4 text-sm dark:bg-neutral-900/50">
          <div className="mb-1 text-lg font-medium">
            Rank across leaderboards
          </div>
          <p className="mb-2 text-neutral-500">Lower rank is better.</p>
          <AppBarChart
            data={[...club.leaderboards]
              .sort((a, b) => b.clubRank - a.clubRank)
              .map((lb) => ({
                name:
                  leaderboards[apiIdToWebId(lb.leaderboardId) as LeaderboardId]
                    ?.nameShort ?? lb.leaderboardId,
                Rank: rankScale.toBarValue(lb.clubRank),
              }))}
            dataKey="Rank"
            yAxisFormatter={rankScale.formatTick}
            valueDomain={rankScale.domain}
            allowDecimals={false}
            tooltip={({ label }) => {
              const lb = club.leaderboards.find(
                (l) =>
                  (leaderboards[apiIdToWebId(l.leaderboardId) as LeaderboardId]
                    ?.nameShort ?? l.leaderboardId) === label,
              );
              const lbName =
                leaderboards[
                  apiIdToWebId(lb?.leaderboardId ?? "") as LeaderboardId
                ]?.name ?? label;
              return (
                <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-sm dark:bg-black">
                  <span className="font-medium">{lbName}</span>
                  {lb && (
                    <span>Club rank #{lb.clubRank.toLocaleString("en")}</span>
                  )}
                </div>
              );
            }}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {club.leaderboards.length > 0 && (
          <Input
            type="search"
            placeholder="Filter leaderboards..."
            className="max-w-xs"
            value={standingsFilter}
            onChange={(e) => setStandingsFilter(e.target.value)}
          />
        )}
        {club.leaderboards.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No leaderboards for this club.
          </p>
        ) : filteredStandings.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No leaderboards match &ldquo;{standingsFilter}&rdquo;.
          </p>
        ) : (
          currentStandings.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {currentSeason}
              </div>
              <StandingsTable
                season={currentSeason}
                standings={currentStandings}
                clubTag={clubTag}
                memberLbIds={memberLbIds}
              />
            </div>
          )
        )}
      </div>

      {/* Separate from the filter group so it gets the same spacing as on the player page */}
      {filteredStandings.length > 0 && previousStandingGroups.length > 0 && (
        <div className="rounded-lg border border-neutral-200 px-4 dark:border-neutral-800">
          <div className="flex items-center gap-2 py-3">
            <History className="size-4 text-neutral-500" />
            <span className="text-sm font-semibold text-neutral-500">
              Previous Seasons
            </span>
            <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
              {previousStandingGroups.reduce(
                (acc, [, entries]) => acc + entries.length,
                0,
              )}{" "}
              leaderboards
            </span>
          </div>
          <Accordion
            type="multiple"
            className="w-full"
            // Open every season while filtering so matches aren't hidden
            value={
              standingsFilter.trim()
                ? previousStandingGroups.map(([season]) => season)
                : openStandingSeasons
            }
            // Every season is forced open while filtering, so don't save that as the open seasons
            onValueChange={(seasons) => {
              if (!standingsFilter.trim()) setOpenStandingSeasons(seasons);
            }}
          >
            {previousStandingGroups.map(([season, entries]) => (
              <AccordionItem key={season} value={season}>
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  <span className="flex items-center gap-2">
                    {season}
                    <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-normal text-neutral-500 dark:bg-neutral-800">
                      {entries.length}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <StandingsTable
                    season={season}
                    standings={entries}
                    clubTag={clubTag}
                    memberLbIds={memberLbIds}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

const StandingsTable = ({
  season,
  standings,
  clubTag,
  memberLbIds,
}: {
  season: string;
  standings: ClubApiLeaderboardEntry[];
  clubTag: string;
  /** Leaderboards the club has members on, linked to the Player ranks tab */
  memberLbIds: LeaderboardId[];
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-inherit">
            <TableHead className="whitespace-nowrap px-3">
              Leaderboard
            </TableHead>
            <TableHead className="whitespace-nowrap px-3 text-right">
              Club rank
            </TableHead>
            <TableHead className="whitespace-nowrap px-3 text-right">
              Members
            </TableHead>
            <TableHead className="whitespace-nowrap px-3 text-right">
              Club total
            </TableHead>
            <TableHead className="px-3">
              <span className="sr-only">Member rankings</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...standings]
            .sort((a, b) => a.clubRank - b.clubRank)
            .map((standing) => {
              const webId = apiIdToWebId(standing.leaderboardId);
              const isKnown = webId in leaderboards;
              const name = isKnown
                ? leaderboards[webId as LeaderboardId].name
                : `Unknown leaderboard (${standing.leaderboardId})`;
              return (
                <TableRow key={standing.leaderboardId}>
                  <TableCell className="p-3 font-medium">
                    {isKnown ? (
                      <Link
                        to="/"
                        search={{
                          lb: webId,
                          panel: panels.CLUBS,
                          clubTag: `exactCt:${clubTag}`,
                        }}
                        title={`View ${clubTag} on the ${name} leaderboard`}
                        className="inline-flex items-center gap-1.5 hover:underline"
                      >
                        {stripSeasonPrefix(name, season)}
                        <ExternalLinkIcon className="size-3.5 text-neutral-400" />
                      </Link>
                    ) : (
                      name
                    )}
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    #{standing.clubRank.toLocaleString("en")}
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    {standing.memberCount.toLocaleString("en")}
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    {formatClubValue(webId, standing.totalValue)}
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    {memberLbIds.includes(webId as LeaderboardId) && (
                      <Link
                        to="/clubs/$clubTag"
                        params={{ clubTag }}
                        search={{
                          tab: "player-ranks",
                          view: "leaderboard",
                          lb:
                            webId === defaultLeaderboardId
                              ? undefined
                              : (webId as LeaderboardId),
                        }}
                        title="Show member rankings"
                        className="inline-flex items-center gap-1.5 whitespace-nowrap text-neutral-500 hover:text-foreground hover:underline"
                      >
                        <UsersRoundIcon className="size-4" />
                        View members
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};
