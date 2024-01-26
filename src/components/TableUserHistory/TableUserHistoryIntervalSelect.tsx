import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinalsTrackerInterval } from "@/sdk/finalsTracker";

export interface TableUserHistoryIntervalSelectProps {
  defaultInterval: FinalsTrackerInterval;
  onIntervalChange: (value: FinalsTrackerInterval) => void;
}

const TableUserHistoryIntervalSelect = ({
  defaultInterval,
  onIntervalChange,
}: TableUserHistoryIntervalSelectProps) => (
  <Tabs
    defaultValue={defaultInterval}
    onValueChange={interval =>
      onIntervalChange(interval as FinalsTrackerInterval)
    }
  >
    <TabsList>
      <TabsTrigger value={FinalsTrackerInterval.HOURLY}>Hourly</TabsTrigger>
      <TabsTrigger value={FinalsTrackerInterval.DAILY}>Daily</TabsTrigger>
      <TabsTrigger value={FinalsTrackerInterval.MONTHLY}>Monthly</TabsTrigger>
    </TabsList>
  </Tabs>
);

export default TableUserHistoryIntervalSelect;
