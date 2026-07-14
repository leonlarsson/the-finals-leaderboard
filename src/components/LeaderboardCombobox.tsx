import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { FC, useState } from "react";
import { FavoriteStarButton } from "@/components/FavoriteStarButton";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLeaderboardFavorites } from "@/hooks/useLeaderboardFavorites";
import { cn } from "@/lib/utils";
import {
  defaultSeason,
  getSeasonGroup,
  Leaderboard,
  LeaderboardId,
  leaderboards,
  seasonOrder,
} from "@/utils/leaderboards";

// Searchable replacement for a plain <Select> of leaderboards.
// Groups items by season (via seasonOrder/getSeasonGroup) so the long
// "Older Leaderboards" list stays scannable instead of one flat list.
export const LeaderboardCombobox: FC<{
  group: "select1" | "select2";
  currentLeaderboard: Leaderboard;
  onSelect: (id: LeaderboardId) => void;
  onHoverItem: (id: LeaderboardId) => void;
}> = ({ group, currentLeaderboard, onSelect, onHoverItem }) => {
  const [open, setOpen] = useState(false);
  const { isLeaderboardFavorite, toggleLeaderboardFavorite } =
    useLeaderboardFavorites();

  const items = Object.values(leaderboards).filter(
    (x) => x.group === group && x.enabled,
  );

  const favoriteItems = items.filter((x) =>
    isLeaderboardFavorite(x.id as LeaderboardId),
  );

  const seasonGroups = seasonOrder
    .map((season) => ({
      season,
      items: items.filter((x) => getSeasonGroup(x.id) === season),
    }))
    .filter((x) => x.items.length > 0);

  const triggerLabel =
    group === "select1"
      ? `Season ${defaultSeason} Leaderboards`
      : "Older Leaderboards";

  // `keyPrefix` keeps values unique when the same leaderboard is rendered
  // twice (once under "Favorites", once under its season group), since cmdk
  // uses `value` to track the highlighted/selected item.
  const renderItem = (lb: Leaderboard, keyPrefix = "") => {
    const favorited = isLeaderboardFavorite(lb.id as LeaderboardId);
    return (
      <CommandItem
        key={`${keyPrefix}${lb.id}`}
        value={`${keyPrefix}${lb.name}`}
        onSelect={() => {
          onSelect(lb.id as LeaderboardId);
          setOpen(false);
        }}
        onPointerEnter={() => onHoverItem(lb.id as LeaderboardId)}
      >
        <CheckIcon
          className={cn(
            "size-4",
            lb.id === currentLeaderboard.id ? "opacity-100" : "opacity-0",
          )}
        />
        <span className="flex-1">{lb.name}</span>
        <FavoriteStarButton
          favorited={favorited}
          onToggle={() => toggleLeaderboardFavorite(lb.id as LeaderboardId)}
          size="size-3.5"
          stopPropagation
        />
      </CommandItem>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 w-max select-none justify-between gap-1.5 font-normal"
        >
          {currentLeaderboard.group === group ? (
            <span className="font-medium">{currentLeaderboard.name}</span>
          ) : (
            triggerLabel
          )}
          <ChevronsUpDownIcon className="size-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search leaderboards..." />
          <CommandList>
            <CommandEmpty>No leaderboard found.</CommandEmpty>
            {favoriteItems.length > 0 && (
              <>
                <CommandGroup heading="Favorites">
                  {favoriteItems.map((lb) => renderItem(lb, "favorite-"))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            {seasonGroups.map(({ season, items: seasonItems }) => (
              <CommandGroup
                key={season}
                heading={seasonGroups.length > 1 ? season : undefined}
              >
                {seasonItems.map((lb) => renderItem(lb))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
