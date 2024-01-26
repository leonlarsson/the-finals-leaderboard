import { Platforms } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FinalsTrackerInterval,
  FinalsTrackerPlatform,
  FinalsTrackerStrategy,
  getHistoryByUser,
  getUsers,
  HistoryByUserResponse,
  UserResponse,
} from "@/sdk/finalsTracker";
import { TableCell, TableRow } from "@/components/ui/table";
import TableUserHistoryError from "./TableUserHistoryError";
import TableUserHistoryData from "@/components/TableUserHistory/TableUserHistoryData";
import TableUserHistoryUserSelect from "@/components/TableUserHistory/TableUserHistoryUserSelect";
import TableUserHistoryLoading from "@/components/TableUserHistory/TableUserHistoryLoading";
import TableUserHistoryIntervalSelect from "@/components/TableUserHistory/TableUserHistoryIntervalSelect";

type TableExpandedRowProps = {
  show: boolean;
  platform: Platforms;
  name: string;
  colSpan: number;
};

function platformToFinalsTrackerPlatform(
  platform: Platforms,
): FinalsTrackerPlatform {
  switch (platform) {
    case Platforms.Crossplay:
      return FinalsTrackerPlatform.CROSSPLAY;
    case Platforms.PSN:
      return FinalsTrackerPlatform.PS;
    case Platforms.Xbox:
      return FinalsTrackerPlatform.XBOX;
    case Platforms.Steam:
      return FinalsTrackerPlatform.STEAM;
    default:
      throw new Error(`Unknown platform ${platform}`);
  }
}

function getStartAndEndDates(interval: FinalsTrackerInterval): {
  startDate: Date;
  endDate: Date;
} {
  const now = new Date();
  const start = new Date(now);

  switch (interval) {
    case FinalsTrackerInterval.HOURLY:
      return {
        startDate: new Date(start.setHours(start.getHours() - 24)),
        endDate: now,
      };
    case FinalsTrackerInterval.DAILY:
      return {
        startDate: new Date(start.setDate(start.getDate() - 30)),
        endDate: now,
      };
    case FinalsTrackerInterval.MONTHLY:
      return {
        startDate: new Date(start.setFullYear(start.getFullYear() - 1)),
        endDate: now,
      };
    default:
      throw new Error(`Unknown interval ${interval}`);
  }
}

type HistoryByIntervalByUser = Record<
  string,
  { [P in FinalsTrackerInterval]?: HistoryByUserResponse }
>;

const TableUserHistory = (props: TableExpandedRowProps) => {
  const { show, platform, name, colSpan } = props;

  const [interval, setInterval] = useState<FinalsTrackerInterval>(
    FinalsTrackerInterval.DAILY,
  );
  const [users, setUsers] = useState<UserResponse>();
  const [activeUserId, setActiveUserId] = useState<string>();
  const [historyByIntervalByUser, setHistoryByIntervalByUser] =
    useState<HistoryByIntervalByUser>({});
  const [isLoading, setIsLoading] = useState(true);

  const updateActiveUserId = useCallback(
    async (
      newUserId: string | undefined,
      newInterval: FinalsTrackerInterval,
    ) => {
      if (!newUserId) return;
      if (
        newUserId &&
        historyByIntervalByUser[newUserId] &&
        historyByIntervalByUser[newUserId][newInterval] !== undefined
      ) {
        setActiveUserId(newUserId);
        setInterval(newInterval);
        return;
      }
      setIsLoading(true);

      const res = await getHistoryByUser(newUserId, {
        interval: newInterval,
        strategy: FinalsTrackerStrategy.FIRST,
        ...getStartAndEndDates(newInterval),
      });

      setHistoryByIntervalByUser(prev => ({
        ...prev,
        [newUserId]: {
          ...prev[newUserId],
          [newInterval]: res,
        },
      }));
      setIsLoading(false);
      setActiveUserId(newUserId);
      setInterval(newInterval);
    },
    [
      historyByIntervalByUser,
      setHistoryByIntervalByUser,
      setIsLoading,
      setActiveUserId,
      setInterval,
    ],
  );

  useEffect(() => {
    if (!show || users !== undefined) return;

    getUsers({ name, platform: platformToFinalsTrackerPlatform(platform) })
      .then(res => {
        if (res.data!.length === 1)
          updateActiveUserId(res.data![0].id, interval);
        else setIsLoading(false);
        setUsers(res);
      })
      .catch(e => {
        setUsers(e);
        setIsLoading(false);
      });
  }, [show, setIsLoading, setUsers, updateActiveUserId]);

  const history = useMemo(() => {
    return activeUserId && historyByIntervalByUser[activeUserId]
      ? historyByIntervalByUser[activeUserId][interval]
      : undefined;
  }, [historyByIntervalByUser, interval, activeUserId]);

  const errors = useMemo(() => {
    if (users?.errors && users.errors.length > 0) return users.errors;
    if (history?.errors && history.errors.length > 0) return history.errors;
    return undefined;
  }, [users, history]);

  if (!show) return;

  const showUserSelect = (users?.data || []).length > 1;
  const showHistory = (history?.data || []).length > 0;
  const showNoData = (!showHistory || !showUserSelect) && !isLoading;

  return (
    <>
      {isLoading && <TableUserHistoryLoading colSpan={colSpan} />}
      {(showUserSelect || showHistory || showNoData) && (
        <TableRow>
          <TableCell colSpan={colSpan} className="h-24 space-y-2 text-center">
            {errors && <TableUserHistoryError errors={errors} />}

            {showUserSelect && (
              <TableUserHistoryUserSelect
                users={users?.data || []}
                setActiveUserId={id => updateActiveUserId(id, interval)}
              />
            )}

            {activeUserId && (
              <TableUserHistoryIntervalSelect
                defaultInterval={interval}
                onIntervalChange={newInterval =>
                  updateActiveUserId(activeUserId, newInterval)
                }
              />
            )}

            {showHistory && (
              <TableUserHistoryData
                history={history?.data || []}
                platform={platformToFinalsTrackerPlatform(platform)}
              />
            )}

            {showNoData && <div>No data available</div>}
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default TableUserHistory;
