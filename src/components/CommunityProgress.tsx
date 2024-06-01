import { useQuery } from "@tanstack/react-query";
import { ProgressBar } from "@tremor/react";
import { CommunityEvent } from "@/utils/communityEvents";
import getDeepProperty from "@/utils/getDeepProperty";

type Props = {
  enabled: boolean;
  eventData: CommunityEvent;
};

const CommunityProgress = ({ enabled, eventData }: Props) => {
  if (!enabled || !eventData) return null;

  const { data, isError } = useQuery({
    queryKey: ["communityEvent", eventData.name],
    queryFn: async () => {
      const res = await fetch(eventData.apiUrl);
      const json = await res.json();
      return {
        goal: eventData.goalDataPath
          ? getDeepProperty(json, eventData.goalDataPath)
          : json.goal,
        total: Math.min(
          eventData.currentDataPath
            ? getDeepProperty(json, eventData.currentDataPath)
            : json.total,
          eventData.initialGoal,
        ),
      };
    },
    refetchInterval: 60_000,
    initialData: { goal: eventData.initialGoal, total: 0 },
  });

  if (isError) return null;

  return (
    <div className="flex flex-col flex-wrap gap-1 rounded-md border p-2 text-sm tabular-nums">
      <span className="font-medium">Community Event | {eventData.name}</span>

      <span className="flex flex-wrap justify-between">
        {eventData.type === "cash" && (
          <>
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
          </>
        )}

        {eventData.type === "distance" && (
          <>
            <span>
              {new Intl.NumberFormat("en", {
                style: "decimal",
                maximumFractionDigits: 0,
              }).format(data.total)}{" "}
              km •{" "}
              {new Intl.NumberFormat("en", {
                style: "percent",
                maximumFractionDigits: 1,
              }).format(data.total / data.goal)}
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
              {data.total.toLocaleString("en")} eliminations •{" "}
              {new Intl.NumberFormat("en", {
                style: "percent",
                maximumFractionDigits: 1,
              }).format(data.total / data.goal)}
            </span>

            <span>{data.goal.toLocaleString("en")} eliminations</span>
          </>
        )}

        {eventData.type === "damage" && (
          <>
            <span>
              {data.total.toLocaleString("en")} damage •{" "}
              {new Intl.NumberFormat("en", {
                style: "percent",
                maximumFractionDigits: 1,
              }).format(data.total / data.goal)}
            </span>

            <span>{data.goal.toLocaleString("en")} damage</span>
          </>
        )}
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
