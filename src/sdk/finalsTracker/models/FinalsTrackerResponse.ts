export interface FinalsTrackerResponseSuccess<T> {
  data: T;
  errors: undefined;
}

export interface FinalsTrackerResponseError {
  data: undefined;
  errors: string[];
}

export type FinalsTrackerResponse<T> =
  | FinalsTrackerResponseSuccess<T>
  | FinalsTrackerResponseError;
