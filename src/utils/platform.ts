// navigator.userAgentData isn't universally supported yet, so fall back to
// the deprecated but still-working navigator.platform / userAgent sniff.
export const isMac = (): boolean =>
  typeof navigator !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export const modKeyLabel = (): string => (isMac() ? "⌘" : "Ctrl");
