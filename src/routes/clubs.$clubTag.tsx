import { clubsQueryOptions } from "@/queries";
import { panels } from "@/types";
import { leaderboards } from "@/utils/leaderboards";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

export const Route = createFileRoute("/clubs/$clubTag")({
  component: RouteComponent,
});

function RouteComponent() {
  const { clubTag } = Route.useParams();

  const query = useQuery(clubsQueryOptions);

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError || !query.data) {
    return <div>Error</div>;
  }

  const club = query.data.find(
    (x) => x.clubTag.toLowerCase() === clubTag.toLowerCase(),
  );

  if (!club) {
    return <div>Club not found</div>;
  }

  return (
    <div className="my-4">
      <div>
        <Link
          to="/"
          search={(prev) => ({ ...prev, panel: panels.CLUBS })}
          className="mb-2 flex w-fit items-center gap-1 font-medium hover:underline"
        >
          <ArrowLeftIcon size={20} /> Back to leaderboards
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <div className="text-xl">
            Club: <span className="font-medium">{club.clubTag}</span>
          </div>

          <div>
            <span className="font-medium">{club.clubTag}</span> has{" "}
            {club.members.length.toLocaleString("en")}{" "}
            {club.members.length === 1 ? "member" : "members"} in the top 10K of
            any leaderboard.
          </div>
        </div>

        <div>
          <span>Club Players:</span>
          <div className="flex flex-wrap gap-1">
            {club.members
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((member) => (
                <Link
                  key={member.name}
                  to="/"
                  search={{ name: member.name }}
                  className="mr-1 cursor-pointer rounded bg-neutral-200 px-1 transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  {member.name}
                </Link>
              ))}
          </div>
        </div>

        <div>
          <span>Club Standings:</span>
          <div className="flex flex-col gap-1">
            {club.leaderboards.map(
              (leaderboard: {
                leaderboard: string;
                rank: number;
                totalValue: number;
              }) => (
                <Link
                  key={leaderboard.leaderboard}
                  to="/"
                  search={{
                    lb: apiIdToWebId(leaderboard.leaderboard),
                    panel: panels.CLUBS,
                    clubTag: `exactCt:${club.clubTag}`,
                  }}
                  className="flex-cols mr-1 cursor-pointer rounded bg-neutral-200 px-1 transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <span className="text-lg font-medium">
                    {Object.values(leaderboards).find(
                      (x) => x.id === apiIdToWebId(leaderboard.leaderboard),
                    )?.name ?? "Unknown leaderboard"}
                  </span>{" "}
                  | <span>Rank #{leaderboard.rank}</span> |{" "}
                  <span>
                    Combined points:{" "}
                    {leaderboard.totalValue.toLocaleString("en")}
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const apiIdToWebId = (lb: string): string =>
  ({
    s5: "season5",
    s5sponsor: "season5Sponsor",
    s5worldtour: "season5WorldTour",
    s5terminalattack: "season5TerminalAttack",
    s5powershift: "season5PowerShift",
    s5quickcash: "season5QuickCash",
    s5bankit: "season5BankIt",
  })[lb] ?? "Unknown";
