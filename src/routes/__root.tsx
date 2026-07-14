import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { CommandPalette } from "@/components/CommandPalette";
import CommunityProgress from "@/components/CommunityProgress";
import { BlueskyIcon, GitHubIcon, XTwitterIcon } from "@/components/icons";
import { KeyboardShortcutsDialog } from "@/components/KeyboardShortcutsDialog";
import BasicLink from "@/components/Link";
import { Notice } from "@/components/Notice";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { communityEvents } from "@/utils/communityEvents";
import { modKeyLabel } from "@/utils/platform";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <div className="fixed bottom-4 right-4 z-40 font-saira">
        <KeyboardShortcutsDialog />
      </div>
      <div className="container mb-12 mt-2 font-saira max-sm:px-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-medium sm:text-3xl">
            <Link to="/">Enhanced Leaderboard – THE FINALS</Link>
          </h1>

          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden select-none items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 min-[800px]:flex"
          >
            <SearchIcon className="size-3.5" />
            Search
            <kbd className="rounded border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-950">
              {modKeyLabel()} K
            </kbd>
          </button>
        </div>

        <h5>
          Select a leaderboard and platform to view the current standings.{" "}
          <button
            id="share-button"
            title="Copy link to clipboard"
            className="w-40 text-left font-semibold hover:underline"
            onClick={() => {
              const shareData = {
                title: document.title,
                text: "Check out the Enhanced Leaderboard for THE FINALS!",
                url: "https://the-finals-leaderboard.com",
              };

              if (
                typeof navigator.canShare === "function" &&
                navigator.canShare(shareData)
              ) {
                navigator.share(shareData);
              } else {
                navigator.clipboard.writeText(shareData.url).then(() => {
                  const button = document.getElementById(
                    "share-button",
                  ) as HTMLButtonElement;
                  button.textContent = "Link copied!";
                  button.disabled = true;
                  setTimeout(() => {
                    button.textContent = "Share this website!";
                    button.disabled = false;
                  }, 1500);
                });
              }
            }}
          >
            Share this website!
          </button>
        </h5>

        <Notice />

        <div className="my-2">
          <CommunityProgress
            eventData={Object.values(communityEvents).find((x) => x.active)}
          />
        </div>
        <Outlet />

        <div className="mt-2 flex flex-col gap-2">
          <div className="text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipContent className="max-w-xs">
                  The developer currently works at Embark&nbsp;Studios, but this
                  website and the API are fully independent.
                </TooltipContent>
                <TooltipTrigger className="cursor-default">
                  This site is not affiliated with{" "}
                  <BasicLink href="https://www.embark-studios.com/">
                    Embark&nbsp;Studios
                  </BasicLink>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
            . All imagery and data is owned by{" "}
            <BasicLink href="https://www.embark-studios.com/">
              Embark&nbsp;Studios
            </BasicLink>
            . Created by{" "}
            <BasicLink href="https://x.com/mozzyfx">Mozzy</BasicLink>. Check out
            the{" "}
            <BasicLink href="https://github.com/leonlarsson/the-finals-api">
              API
            </BasicLink>
            .
          </div>

          <div className="flex gap-2">
            <ThemeToggle />
            <BasicLink href="https://x.com/mozzyfx">
              <Button variant="outline" size="icon">
                <XTwitterIcon className="!size-5" />
              </Button>
            </BasicLink>

            <BasicLink href="https://bsky.app/profile/leon.ms">
              <Button variant="outline" size="icon">
                <BlueskyIcon className="!size-5" />
              </Button>
            </BasicLink>

            <BasicLink href="https://github.com/leonlarsson/the-finals-leaderboard">
              <Button variant="outline" size="icon">
                <GitHubIcon className="!size-5" />
              </Button>
            </BasicLink>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
