import { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";

type Props<TData> = {
  table: Table<TData>;
};

export default function <TData>({ table }: Props<TData>) {
  return (
    <div className="flex flex-wrap gap-2">
      <Input
        className="max-w-xs select-none data-[active=true]:border-black/50 dark:data-[active=true]:border-white/50"
        data-active={!!table.getColumn("clubTag")?.getFilterValue()}
        placeholder="Filter club tags..."
        maxLength={20}
        value={(table.getColumn("clubTag")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          table.getColumn("clubTag")?.setFilterValue(event.target.value);
          const searchParams = new URLSearchParams(window.location.search);

          event.target.value.length
            ? searchParams.set("clubTag", event.target.value)
            : searchParams.delete("clubTag");
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
