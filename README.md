# Enhanced THE FINALS Leaderboard

This is a leaderboard for THE FINALS, a game from Embark Studios. This project aims to provide a better leaderboard than the one provided by Embark Studios, with additional features such as searching, filtering, sorting, more leaderboards, all while being faster.

To run locally:

```bash
npm install
npm run dev
```

### Adding a new leaderboard

TODO: Update due to changes in https://github.com/leonlarsson/the-finals-leaderboard/pull/17 and https://github.com/leonlarsson/the-finals-leaderboard/pull/19 for the new routes /players/{player}, /players, and /clubs

1. Add new leaderboards to `src/utils/leaderboards.tsx`. Usually just means copy pasting, updating `leaderboard.group`, `defaultLeaderboardId`, and `leaderboardIdsToPrefetch`
2. Add new leaderboards metadata to `src/components/panels/ClubsStatsPanel.tsx`
3. Add new leaderboards to `src/utils/leagues.ts`
4. Add new leaderboards to `src/routes/clubs.$clubTag.tsx` (`apiIdToWebId`)
5. Add new leaderboards to `src/components/tables/ClubsDataTableColumns.tsx` (`columnsByLeaderboard`)
6. For sponsors, add sponsors in `src/components/panels/LeaderboardStatsPanel.tsx`. (`allSponsors`, `leaderboardToSponsors`). Add seasonXSponsors to if check. Add sponsor color to `tailwind.config.ts`
7. For sponsors, add new sponsors to `src/components/SponsorImage.tsx` (`sponsors`, `styles`)
8. For sponsors, make sure to create and add the relevant images normal and -icon variants to `public/images/sponsors/`
