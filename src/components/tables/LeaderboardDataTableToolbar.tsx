import { Table } from "@tanstack/react-table";
import { CheckIcon, ClockIcon, PlusCircle, XIcon } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useSearchHistory } from "@/hooks/useSearchHistory";
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

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { history, addToHistory, removeFromHistory } = useSearchHistory();

  useHotkeys(
    "/",
    (e) => {
      e.preventDefault();
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    },
    { enableOnFormTags: false },
  );

  const handleSelectHistory = (selectedName: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = selectedName;
    }
    nameColumn.setFilterValue(selectedName);
    navigate({
      viewTransition: true,
      search: (prev) => ({
        ...prev,
        name: selectedName.length ? selectedName : undefined,
      }),
    });
    setHistoryOpen(false);
  };

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
      <div className="group relative max-w-xs flex-1">
        <Input
          ref={searchInputRef}
          type="search"
          className="w-full select-none pr-12 data-[active=true]:border-black/50 dark:data-[active=true]:border-white/50"
          data-active={!!name}
          placeholder="Filter usernames..."
          maxLength={20}
          defaultValue={name}
          onFocus={() => {
            if (history.length > 0) setHistoryOpen(true);
          }}
          onBlur={(e) => {
            setHistoryOpen(false);
            if (e.target.value) addToHistory(e.target.value);
          }}
          onChange={(event) => {
            nameColumn.setFilterValue(event.target.value);
            navigate({
              viewTransition: true,
              search: (prev) => ({
                ...prev,
                name: event.target.value.length
                  ? event.target.value
                  : undefined,
              }),
            });
          }}
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-neutral-200 px-1.5 py-0.5 font-mono text-xs text-neutral-400 transition-opacity group-focus-within:opacity-0 dark:border-neutral-700">
          /
        </kbd>

        {/* History dropdown */}
        {historyOpen && history.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              <ClockIcon className="size-3" />
              Recent searches
            </div>
            {history.map((historyName) => (
              <div
                key={historyName}
                className="flex items-center justify-between gap-1 px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <button
                  className="flex-1 text-left text-sm"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectHistory(historyName);
                  }}
                >
                  {historyName}
                </button>
                <button
                  className="shrink-0 text-neutral-400 hover:text-red-500"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    removeFromHistory(historyName);
                  }}
                  title="Remove from history"
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
