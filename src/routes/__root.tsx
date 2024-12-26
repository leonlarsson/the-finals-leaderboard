import CommunityProgress from "@/components/CommunityProgress";
import { BlueskyIcon, GitHubIcon, XTwitterIcon } from "@/components/icons";
import BasicLink from "@/components/Link";
import { Notice } from "@/components/Notice";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { communityEvents } from "@/utils/communityEvents";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <div className="container mb-12 mt-2 font-saira max-sm:px-2">
        <h1 className="text-2xl font-medium sm:text-3xl">
          Enhanced Leaderboard – THE FINALS
        </h1>

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
            This site is not affiliated with{" "}
            <BasicLink href="https://www.embark-studios.com/">
              Embark Studios
            </BasicLink>
            . All imagery and data is owned by{" "}
            <BasicLink href="https://www.embark-studios.com/">
              Embark Studios
            </BasicLink>
            . Created by{" "}
            <BasicLink href="https://bsky.app/profile/leon.ms">Mozzy</BasicLink>
            . Check out the{" "}
            <BasicLink href="https://github.com/leonlarsson/the-finals-api">
              API
            </BasicLink>
            .
          </div>

          <div className="flex gap-2">
            <ThemeToggle />
            <BasicLink href="https://bsky.app/profile/leon.ms">
              <Button variant="outline" size="icon">
                <BlueskyIcon className="size-5" />
              </Button>
            </BasicLink>

            <BasicLink href="https://x.com/mozzyfx">
              <Button variant="outline" size="icon">
                <XTwitterIcon className="size-5" />
              </Button>
            </BasicLink>

            <BasicLink href="https://github.com/leonlarsson/the-finals-leaderboard">
              <Button variant="outline" size="icon">
                <GitHubIcon className="size-5" />
              </Button>
            </BasicLink>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
