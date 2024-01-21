import { useEffect, useState } from "react";
import { Table } from "@tanstack/react-table";
import { CheckIcon, PlusCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { LEADERBOARD_VERSION } from "@/helpers/leagues";
import { cn } from "@/lib/utils";
import { Platforms } from "@/types";

type Props<TData> = {
  leaderboardVersion: LEADERBOARD_VERSION;
  platform: Platforms;
  table: Table<TData>;
};

export default function <TData>({
  leaderboardVersion,
  platform,
  table,
}: Props<TData>) {
  const [didMount, setDidMount] = useState(false);
  const fameColumn = table.getColumn("fame");
  const uniqueLeagues = [
    ...new Set(
      Array.from(fameColumn?.getFacetedUniqueValues()?.keys() ?? []).map(
        ({ league }) => league,
      ),
    ),
  ];

  const selectedValues = new Set(fameColumn!.getFilterValue() as string[]);

  // Setting didMount to true upon mounting
  useEffect(() => {
    setDidMount(true);
  }, []);

  // Reset fame filter on version or platform. Only done after first render since we don't want to reset the filter on initial load
  useEffect(() => {
    if (!didMount) return;
    selectedValues.clear();
    fameColumn?.setFilterValue(selectedValues);
  }, [leaderboardVersion, platform]);

  // Save fame filter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    selectedValues.size
      ? searchParams.set("leagues", Array.from(selectedValues).join(","))
      : searchParams.delete("leagues");

    window.history.replaceState(
      null,
      "",
      searchParams.size > 0 ? `?${searchParams.toString()}` : "/",
    );
  }, [selectedValues]);

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

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-10 border-dashed">
            <PlusCircle className="mr-2 h-4 w-4" />
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
                    Array.from(selectedValues).map(value => (
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
                {uniqueLeagues.map(league => {
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
                      onSelect={() => fameColumn?.setFilterValue(undefined)}
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
    </div>
  );
}
