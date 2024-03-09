import { useQuery } from "@tanstack/react-query";
import { ProgressBar } from "@tremor/react";
import Link from "./Link";

const CommunityProgress = () => {
  const { data, isError } = useQuery({
    queryKey: ["communityEvent"],
    queryFn: async () => {
      const res = await fetch(
        "https://storage.googleapis.com/embark-discovery-leaderboard/community-event-leaderboard-discovery-live.json",
      );
      const json = (await res.json()) as { goal: number; total: number };
      return {
        goal: json.goal,
        total: Math.min(json.total, 250_000_000_000),
      };
    },
    refetchInterval: 30_000,
    initialData: { goal: 250_000_000_000, total: 0 },
  });

  if (isError) return null;

  return (
    <div className="flex flex-col flex-wrap gap-1 rounded-md border p-2 text-sm tabular-nums">
      <Link href="https://www.reachthefinals.com/community-event">
        Community Event | Cashouts
      </Link>

      <span className="flex flex-wrap justify-between">
        <span>
          {new Intl.NumberFormat("en", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(data.total)}{" "}
          •{" "}
          {new Intl.NumberFormat("en", {
            style: "percent",
            maximumFractionDigits: 1,
          }).format(data.total / data.goal)}
        </span>

        <span>
          {new Intl.NumberFormat("en", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(data.goal)}
        </span>
      </span>

      <ProgressBar
        showAnimation
        color="red"
        value={(data.total / data.goal) * 100}
      />
    </div>
  );
};

export default CommunityProgress;
