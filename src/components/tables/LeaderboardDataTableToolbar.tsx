import { Table } from "@tanstack/react-table";
import { CheckIcon, PlusCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { LeaderboardId, leaderboards } from "@/utils/leaderboards";
import { getRouteApi } from "@tanstack/react-router";
import { Input } from "../ui/input";

type LeaderboardDataTableToolbarProps<TData> = {
  leaderboardId: LeaderboardId;
  table: Table<TData>;
};

export function LeaderboardDataTableToolbar<TData>({
  leaderboardId,
  table,
}: LeaderboardDataTableToolbarProps<TData>) {
  const { useSearch, useNavigate } = getRouteApi("/");
  const { name } = useSearch({
    select: ({ name }) => ({
      name: name ?? "",
    }),
  });
  const navigate = useNavigate();

  const nameColumn = table.getColumn("name")!;
  const fameColumn = leaderboards[leaderboardId].features.includes(
    "leagueFilter",
  )
    ? table.getColumn("fame")
    : null;
  const uniqueLeagues = [
    ...new Set(
      Array.from(fameColumn?.getFacetedUniqueValues()?.keys() ?? []).map(
        ({ league }) => league,
      ),
    ),
  ];

  const selectedValues = new Set(fameColumn?.getFilterValue() as string[]);

  return (
    <div className="flex flex-wrap gap-2">
      <Input
        type="search"
        className="max-w-xs select-none data-[active=true]:border-black/50 dark:data-[active=true]:border-white/50"
        data-active={!!name}
        placeholder="Filter usernames..."
        maxLength={20}
        defaultValue={name}
        onChange={(event) => {
          nameColumn.setFilterValue(event.target.value);

          navigate({
            viewTransition: true,
            search: (prev) => ({
              ...prev,
              name: event.target.value.length ? event.target.value : undefined,
            }),
          });
        }}
      />

      {leaderboards[leaderboardId].features.includes("leagueFilter") && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 select-none border-dashed data-[active=true]:border-black/50 dark:data-[active=true]:border-white/50"
              data-active={selectedValues.size > 0}
            >
              <PlusCircle className="h-4 w-4" />
              Filter leagues
              {selectedValues.size > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-medium md:hidden"
                  >
                    {selectedValues.size}
                  </Badge>

                  <div className="hidden gap-1 font-medium md:flex">
                    {selectedValues.size > 2 ? (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-medium"
                      >
                        {selectedValues.size} selected
                      </Badge>
                    ) : (
                      Array.from(selectedValues).map((value) => (
                        <Badge
                          key={value}
                          variant="secondary"
                          className="rounded-sm px-1 font-medium"
                        >
                          {value}
                        </Badge>
                      ))
                    )}
                  </div>
                </>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0 font-saira" align="start">
            <Command>
              <CommandInput placeholder="Filter..." />
              <CommandList>
                <CommandEmpty>No league found.</CommandEmpty>

                <CommandGroup>
                  {uniqueLeagues.map((league) => {
                    const isSelected = selectedValues.has(league);

                    // TODO: Take current filters into account?
                    const amountOfPlayersInLeague = Array.from(
                      fameColumn?.getFacetedUniqueValues().keys() ?? [],
                    ).filter(({ league: l }) => l === league).length;

                    return (
                      <CommandItem
                        // https://github.com/shadcn-ui/ui/pull/1522
                        value={league}
                        key={league}
                        onSelect={() => {
                          isSelected
                            ? selectedValues.delete(league)
                            : selectedValues.add(league);

                          const filterValues = Array.from(selectedValues);
                          fameColumn?.setFilterValue(filterValues);

                          navigate({
                            search: (prev) => ({
                              ...prev,
                              leagues: filterValues.length
                                ? filterValues
                                : undefined,
                            }),
                          });
                        }}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          <CheckIcon className={cn("h-4 w-4")} />
                        </div>

                        <div className="flex w-full items-center justify-between">
                          <span>{league}</span>
                          <Badge
                            variant="secondary"
                            className="rounded-sm px-1 text-xs"
                          >
                            {amountOfPlayersInLeague.toLocaleString("en")}
                          </Badge>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>

                {selectedValues.size > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          fameColumn?.setFilterValue(undefined);
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              leagues: undefined,
                            }),
                          });
                        }}
                        className="justify-center text-center"
                      >
                        Clear filters
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
