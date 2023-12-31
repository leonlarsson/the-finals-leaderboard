import { useEffect, useMemo, useState } from "react";
import { LineChart } from "@mui/x-charts";
import LinearProgress from "@mui/material/LinearProgress";
import {
  getLeaderboardByUsername,
  UserLeaderboardResponse,
} from "@/sdk/finalsTracker";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Platforms } from "@/types";

type TableExpandedRowProps = {
  show: boolean;
  platform: Platforms;
  name: string;
  colSpan: number;
};

export const TableExpandedRow = ({
  show,
  platform,
  name,
  colSpan,
}: TableExpandedRowProps) => {
  const [response, setResponse] = useState<UserLeaderboardResponse>();
  const [responseIndex, setResponseIndex] = useState(0);

  const { dates, fames, ranks } = useMemo(() => {
    if (!response?.data || response.data.length === 0) return {};
    const { data } = response.data[responseIndex];

    return {
      dates: data.map(x => new Date(`${x.date}T00:00:00`)),
      fames: data.map(x => x.fame),
      ranks: data.map(x => x.rank * -1),
    };
  }, [response, responseIndex]);

  useEffect(() => {
    if (!show || response !== undefined) return;

    getLeaderboardByUsername({
      name,
      platform: platform === Platforms.PSN ? "playstation" : platform,
    }).then(res => setResponse(res));
  }, [show]);

  if (!show && !response) return null;

  if (!response)
    return (
      <TableRow>
        <TableCell colSpan={colSpan} style={{ padding: 0 }}>
          <LinearProgress />
        </TableCell>
      </TableRow>
    );

  if (response.errors && response?.errors.length > 0)
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="h-24 text-center">
          <span>Something went wrong while fetching table data.</span>
          <br />
          {response.errors.map((err, i) => (
            <span key={i}>{err}</span>
          ))}
        </TableCell>
      </TableRow>
    );

  if (
    !dates ||
    !fames ||
    !ranks ||
    dates.length === 0 ||
    fames.length === 0 ||
    ranks.length === 0
  )
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="h-24 text-center">
          <span>No data available</span>
        </TableCell>
      </TableRow>
    );

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        {(response.data?.length || 0) > 1 && (
          <Tabs
            value={responseIndex.toString()}
            onValueChange={e => setResponseIndex(parseInt(e))}
          >
            <TabsList>
              {response.data?.map((user, index) => (
                <TabsTrigger value={index.toString()}>{user.name}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
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
