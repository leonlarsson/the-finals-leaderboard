import axios, { AxiosInstance } from "axios";

export const API: AxiosInstance = axios.create({
  baseURL: "https://api.finals-tracker.com/api/",
});

export enum FinalsTrackerUrls {
  USER_LEADERBOARD = "/v1/users/leaderboard",
}
