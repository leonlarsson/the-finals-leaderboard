import { Table } from "@tanstack/react-table";
import { Input } from "./ui/input";

type Props<TData> = {
  table: Table<TData>;
};

export default function <TData>({ table }: Props<TData>) {
  return (
    <div className="flex flex-wrap gap-2">
      <Input
        className="max-w-xs"
        placeholder="Filter usernames..."
        maxLength={20}
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={event => {
          table.getColumn("name")?.setFilterValue(event.target.value);
          const searchParams = new URLSearchParams(window.location.search);

          event.target.value.length
            ? searchParams.set("name", event.target.value)
            : searchParams.delete("name");
          window.history.replaceState(
            null,
            "",
            searchParams.size > 0 ? `?${searchParams.toString()}` : "/",
          );
        }}
      />
    </div>
  );
}
