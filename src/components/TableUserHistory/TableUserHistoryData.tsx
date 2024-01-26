import { LineChart } from "@mui/x-charts";
import {
  FinalsTrackerPlatform,
  FinalsTrackerUserLeaderboard,
} from "@/sdk/finalsTracker";
import { useMemo } from "react";

export interface TableUserHistoryDataProps {
  history: FinalsTrackerUserLeaderboard[];
  platform: FinalsTrackerPlatform;
}

const TableUserHistoryData = ({
  history,
  platform,
}: TableUserHistoryDataProps) => {
  const { dates, fames, ranks } = useMemo(() => {
    const dates: Date[] = [],
      fames: number[] = [],
      ranks: number[] = [];

    for (const item of history) {
      dates.push(item.timestamp);
      fames.push(item.fame);
      ranks.push(
        item.rank[platform === FinalsTrackerPlatform.PS ? "ps" : platform] * -1,
      );
    }

    return { dates, fames, ranks };
  }, [history, platform]);

  return (
    <>
      <LineChart
        margin={{ left: 63, right: 63 }}
        xAxis={[
          {
            data: dates,
            valueFormatter: (date: Date) =>
              date.toLocaleDateString(undefined, {
                month: "2-digit",
                day: "2-digit",
                // year: "2-digit",
              }),
            scaleType: "time",
          },
        ]}
        yAxis={[
          {
            id: "fameAxis",
            scaleType: "linear",
            tickMinStep: 20_000,
            max: Math.max(...fames!) * 1.2,
            min: Math.min(...fames!) * 0.2,
            valueFormatter: value => value.toLocaleString("en"),
          },
          {
            id: "rankAxis",
            scaleType: "linear",
            tickMinStep: 1,
            valueFormatter: value => (value * -1).toLocaleString("en"),
          },
        ]}
        series={[
          {
            yAxisKey: "fameAxis",
            data: fames,
            label: "Fame",
            valueFormatter: value => value.toLocaleString("en"),
          },
          {
            yAxisKey: "rankAxis",
            data: ranks,
            label: "Rank",
            valueFormatter: value => (value * -1).toLocaleString("en"),
          },
        ]}
        leftAxis="fameAxis"
        rightAxis="rankAxis"
        height={400}
      />
    </>
  );
};

// Tremor exploration
/* <LineChart
  data={
    response.data?.[responseIndex].data.map(x => ({
      date: x.date,
      Rank: x.rank * -1,
      Fame: x.fame,
    })) ?? []
  }
  index="date"
  categories={["Fame", "Rank"]}
  colors={["#d31f3c", "blue"]}
  valueFormatter={v => v.toLocaleString("en")}
  showAnimation
  curveType="natural"
  minValue={Math.min(...ranks) * 0.2}
  customTooltip={({ label, payload }) => {
    const { Fame, Rank } = payload?.[0]?.payload ?? {};
    
    return (
      <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-left text-sm dark:bg-black">
        <span className="font-medium">{label}</span>
        <hr />
        <span>Rank: {Rank?.toLocaleString("en")}</span>
        <span>Fame: {Fame?.toLocaleString("en")}</span>
      </div>
    );
  }}
/> */

export default TableUserHistoryData;
