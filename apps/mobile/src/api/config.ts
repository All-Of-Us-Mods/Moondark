export const API_BASE =
  typeof __DEV__ !== "undefined" && __DEV__
    ? "http://localhost:3001"
    : "https://api.moondark.gg";
