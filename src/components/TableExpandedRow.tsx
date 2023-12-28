import { Platforms } from "@/types";
import { useEffect, useMemo, useState } from "react";
import {
  getLeaderboardByUsername,
  UserLeaderboardResponse,
} from "@/sdk/finalsTracker";
import { TableCell, TableRow } from "@/components/ui/table";
import { LineChart } from "@mui/x-charts";

export interface TableExpandedRowProps {
  show: boolean;
  platform: Platforms;
  name: string;
  colSpan: number;
}

export const TableExpandedRow = (props: TableExpandedRowProps) => {
  const { show, platform, name, colSpan } = props;
  const [data, setData] = useState<UserLeaderboardResponse>();
  const { dates, fames, ranks } = useMemo(
    () => ({
      dates: data?.data?.map(x => new Date(`${x.date}T00:00:00`)),
      fames: data?.data?.map(x => x.fame),
      ranks: data?.data?.map(x => x.rank * -1),
    }),
    [data],
  );

  useEffect(() => {
    if (!show || data !== undefined) return;

    getLeaderboardByUsername(name, {
      platform: platform === Platforms.PSN ? "playstation" : platform,
    })
      .then(res => setData(res.data))
      .catch(e => setData(e.response.data));
  }, [show]);

  if (!show || !data) return;

  if (data.errors && data?.errors.length > 0)
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="h-24 text-center">
          <span>Something went wrong while fetching table data.</span>
          <br />
          {data.errors.map((err, i) => (
            <span key={i}>{err}</span>
          ))}
        </TableCell>
      </TableRow>
    );

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <LineChart
          xAxis={[
            {
              data: dates,
              valueFormatter: (date: Date) => date.toLocaleDateString(),
              scaleType: "time",
              tickLabelInterval: (date: Date) => date.getHours() === 0,
            },
          ]}
          yAxis={[
            {
              id: "fameAxis",
              scaleType: "linear",
              tickMinStep: 20_000,
              max: Math.max(...fames!) * 1.2,
              min: Math.min(...fames!) * 0.2,
            },
            {
              id: "rankAxis",
              scaleType: "linear",
              tickMinStep: 1,
              valueFormatter: value => (value * -1).toString(),
            },
          ]}
          series={[
            {
              yAxisKey: "rankAxis",
              data: ranks,
              label: "Rank",
              valueFormatter: value => (value * -1).toString(),
            },
            {
              yAxisKey: "fameAxis",
              data: fames,
              label: "Fame",
            },
          ]}
          leftAxis="fameAxis"
          rightAxis="rankAxis"
          height={400}
        />
      </TableCell>
    </TableRow>
  );
};
