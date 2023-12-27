export interface FinalsTrackerResponse<T> {
  data?: T,
  errors?: string[]
}

export interface UserLeaderboardData {
  rank: number,
  fame: number,
  date: string
}
