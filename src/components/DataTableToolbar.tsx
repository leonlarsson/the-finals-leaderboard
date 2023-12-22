import { useEffect } from "react";
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
  const fameColumn = table.getColumn("fame");
  const uniqueLeagues = [
    ...new Set(
      Array.from(fameColumn?.getFacetedUniqueValues()?.keys() ?? []).map(
        ({ league }) => league,
      ),
    ),
  ];

  const selectedValues = new Set(fameColumn!.getFilterValue() as string[]);

  // Reset fame filter on version or platform
  useEffect(() => {
    selectedValues.clear();
    fameColumn?.setFilterValue(selectedValues);
  }, [leaderboardVersion, platform]);

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
            Filter leagues ({selectedValues.size})
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0" align="start">
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
                        <span className="font-mono text-xs">
                          {amountOfPlayersInLeague.toLocaleString("en")}
                        </span>
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
