import { dev } from "$app/environment";

export const API_BASE = dev
  ? "http://localhost:3001"
  : "https://api.moondark.gg";
