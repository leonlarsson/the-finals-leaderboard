export interface FinalsTrackerResponse<T> {
  data?: T;
  errors?: string[];
}

export interface FinalsTrackerSuccessResponse<T> {
  data: T
}

export interface FinalsTrackerErrorResponse {
  errors: string[];
}

export interface LeaderboardUser {
  name: string;
  data: LeaderboardData[];
}

export interface LeaderboardData {
  rank: number;
  fame: number;
  date: string;
}
