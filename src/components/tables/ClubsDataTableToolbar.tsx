import { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { getRouteApi } from "@tanstack/react-router";

type Props<TData> = {
  table: Table<TData>;
};

export default function <TData>({ table }: Props<TData>) {
  const { useSearch, useNavigate } = getRouteApi("/");
  const clubTag = useSearch({
    select: ({ clubTag }) => clubTag ?? "",
  });
  const navigate = useNavigate();

  const clubTagColumn = table.getColumn("clubTag")!;

  return (
    <div className="flex flex-wrap gap-2">
      <Input
        type="search"
        className="max-w-xs select-none data-[active=true]:border-black/50 dark:data-[active=true]:border-white/50"
        data-active={!!table.getColumn("clubTag")?.getFilterValue()}
        placeholder="Filter club tags..."
        maxLength={20}
        defaultValue={clubTag}
        onChange={(event) => {
          clubTagColumn.setFilterValue(event.target.value);

          navigate({
            viewTransition: true,
            search: (prev) => ({
              ...prev,
              clubTag: event.target.value.length
                ? event.target.value
                : undefined,
            }),
          });
        }}
      />
    </div>
  );
}
