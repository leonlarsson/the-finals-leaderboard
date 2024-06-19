export default (url: string, options?: Omit<RequestInit, "cache">) =>
  fetch(url, { ...options, cache: "no-store" });
