# Enhanced THE FINALS Leaderboard

This is a leaderboard for THE FINALS, a game from Embark Studios. This project aims to provide a better leaderboard than the one provided by Embark Studios, with additional features such as searching, filtering, sorting, more leaderboards, all while being faster.

To run locally:

```bash
npm install
npm run dev
```

### Adding a new leaderboard

1. Add new leaderboards to `src/utils/leaderboards.tsx`. Usually just means copy pasting, updating `leaderboard.group`, `defaultLeaderboardId`, `leaderboardIdsToPrefetch`, `apiIdToWebId`, `getSeasonGroup`, and `seasonOrder`
2. If the leaderboard uses the `"leagueFilter"` feature, add it to `src/utils/leagues.ts`
3. Add new leaderboards to `src/utils/leagues.ts`
4. **(Sponsor leaderboards only)** Add the sponsor list to `leaderboardToSponsors` in `src/components/panels/LeaderboardStatsPanel.tsx`. Add new sponsors to `allSponsors` in the same file if they're new
5. **(New sponsors only)** Add the sponsor to `src/components/SponsorImage.tsx` (`sponsors` array + `styles` object). Create and add sponsor images (normal and `-icon` variants) to `public/images/sponsors/`.
