/** Splits "Name#1234" into its name and tag at the first "#". The tag is undefined for names without one */
export const splitPlayerName = (name: string) => {
  const index = name.indexOf("#");
  return index === -1
    ? { name, tag: undefined }
    : { name: name.slice(0, index), tag: name.slice(index + 1) };
};
