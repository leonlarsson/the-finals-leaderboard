import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useNavigate } from "@tanstack/react-router";
import { ClockIcon, SearchIcon, UserRoundIcon } from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { history, addToHistory } = useSearchHistory();

  useHotkeys("mod+k", (e) => {
    e.preventDefault();
    setOpen((o) => !o);
  });

  // Search on main leaderboard page — partial match, like the main filter
  const handleSearch = (name: string) => {
    const cleaned = name.replace(/\s/g, "");
    if (!cleaned) return;
    addToHistory(cleaned);
    navigate({ to: "/", search: { name: cleaned } });
    setOpen(false);
    setQuery("");
  };

  // Navigate directly to player profile — requires exact name (e.g. Name#1234)
  const handleProfile = (name: string) => {
    const cleaned = name.replace(/\s/g, "");
    if (!cleaned) return;
    addToHistory(cleaned);
    navigate({ to: "/players/$playerName", params: { playerName: cleaned } });
    setOpen(false);
    setQuery("");
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search for a player..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => {
          if (e.key === "Enter" && query.replace(/\s/g, "")) {
            handleSearch(query);
          }
        }}
      />
      <CommandList>
        {query.trim() && (
          <CommandGroup heading="Search">
            <CommandItem onSelect={() => handleSearch(query.trim())}>
              <SearchIcon className="mr-2 size-4 text-neutral-400" />
              <span>Search for &ldquo;{query.trim()}&rdquo;</span>
              <span className="ml-auto text-xs text-neutral-400">↵</span>
            </CommandItem>
            <CommandItem onSelect={() => handleProfile(query.trim())}>
              <UserRoundIcon className="mr-2 size-4 text-neutral-400" />
              <span>Open profile for &ldquo;{query.trim()}&rdquo;</span>
              <span className="ml-auto text-xs text-neutral-400">
                exact match
              </span>
            </CommandItem>
          </CommandGroup>
        )}

        {history.length > 0 && (
          <>
            {query.trim() && <CommandSeparator />}
            <CommandGroup heading="Recent searches">
              {history.map((name) => (
                <CommandItem key={name} onSelect={() => handleSearch(name)}>
                  <ClockIcon className="mr-2 size-4 text-neutral-400" />
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {!query && history.length === 0 && (
          <CommandEmpty>
            <SearchIcon className="mx-auto mb-2 size-6 text-neutral-400" />
            Type a player name to search.
          </CommandEmpty>
        )}
      </CommandList>
    </CommandDialog>
  );
}
