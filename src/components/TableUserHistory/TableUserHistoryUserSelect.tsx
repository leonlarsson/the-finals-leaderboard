import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinalsTrackerUser } from "@/sdk/finalsTracker";

export interface TableUserHistoryUserSelectProps {
  users: FinalsTrackerUser[];
  setActiveUserId: (id: string) => void;
}

const TableUserHistoryUserSelect = ({
  users,
  setActiveUserId,
}: TableUserHistoryUserSelectProps) => {
  return (
    <>
      <Tabs onValueChange={setActiveUserId}>
        <TabsList>
          {users.map(({ id, name }) => (
            <TabsTrigger key={id} value={id}>
              {name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  );
};

export default TableUserHistoryUserSelect;
