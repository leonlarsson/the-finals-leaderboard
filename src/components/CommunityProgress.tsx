import { useQuery } from "@tanstack/react-query";
import { ProgressBar } from "@tremor/react";
import { CommunityEvent } from "@/utils/communityEvents";

type Props = {
  eventData?: CommunityEvent;
};

const CommunityProgress = ({ eventData }: Props) => {
  if (!eventData) return null;

  const { data, isError } = useQuery({
    queryKey: ["communityEvent", eventData.name],
    queryFn: async () => {
      const data = await eventData.fetchData();
      return {
        goal: data.progress.goal,
        current: Math.min(data.progress.current, eventData.initialGoal),
      };
    },
    refetchInterval: 60_000,
    initialData: { goal: eventData.initialGoal, current: 0 },
  });

  if (isError) return null;

  return (
    <div className="flex flex-col flex-wrap gap-1 rounded-md border p-2 text-sm tabular-nums">
      <span className="font-medium">{eventData.name}</span>

      <span className="flex flex-wrap justify-between">
        {eventData.type === "cash" && (
          <>
            <span>
              {new Intl.NumberFormat("en", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(data.current)}{" "}
              •{" "}
              {new Intl.NumberFormat("en", {
                style: "percent",
                maximumFractionDigits: 1,
              }).format(data.current / data.goal)}
            </span>

            <span>
              {new Intl.NumberFormat("en", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(data.goal)}
            </span>
          </>
        )}

        {eventData.type === "distance" && (
          <>
            <span>
              {new Intl.NumberFormat("en", {
                style: "decimal",
                maximumFractionDigits: 0,
              }).format(data.current)}{" "}
              km •{" "}
              {new Intl.NumberFormat("en", {
                style: "percent",
                maximumFractionDigits: 1,
              }).format(data.current / data.goal)}
            </span>

            <span>
              {new Intl.NumberFormat("en", {
                style: "decimal",
                maximumFractionDigits: 0,
              }).format(data.goal)}{" "}
              km
            </span>
          </>
        )}

        {eventData.type === "eliminations" && (
          <>
            <span>
              {data.current.toLocaleString("en")} eliminations •{" "}
              {new Intl.NumberFormat("en", {
                style: "percent",
                maximumFractionDigits: 1,
              }).format(data.current / data.goal)}
            </span>

            <span>{data.goal.toLocaleString("en")} eliminations</span>
          </>
        )}

        {eventData.type === "damage" && (
          <>
            <span>
              {data.current.toLocaleString("en")} damage •{" "}
              {new Intl.NumberFormat("en", {
                style: "percent",
                maximumFractionDigits: 1,
              }).format(data.current / data.goal)}
            </span>

            <span>{data.goal.toLocaleString("en")} damage</span>
          </>
        )}

        {eventData.type === "roundsPlayed" && (
          <>
            <span>
              {data.current.toLocaleString("en")} rounds played •{" "}
              {new Intl.NumberFormat("en", {
                style: "percent",
                maximumFractionDigits: 1,
              }).format(data.current / data.goal)}
            </span>

            <span>{data.goal.toLocaleString("en")} rounds played</span>
          </>
        )}

        {eventData.type === "grenadeDetonations" && (
          <>
            <span>
              {data.current.toLocaleString("en")} grenades detonated •{" "}
              {new Intl.NumberFormat("en", {
                style: "percent",
                maximumFractionDigits: 1,
              }).format(data.current / data.goal)}
            </span>

            <span>{data.goal.toLocaleString("en")} grenades detonated</span>
          </>
        )}
      </span>

      <ProgressBar
        showAnimation
        color="red"
        value={(data.current / data.goal) * 100}
      />
    </div>
  );
};

export default CommunityProgress;
