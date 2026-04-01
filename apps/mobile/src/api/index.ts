import { API_BASE } from "./config";
import type { Mod, Session } from "@moondark/types";

export async function fetchMods(): Promise<Mod[]> {
  const res = await fetch(`${API_BASE}/mods`);
  return res.json();
}

export async function fetchMod(id: string): Promise<Mod> {
  const res = await fetch(`${API_BASE}/mods/${id}`);
  return res.json();
}

export async function createSession(
  userId: string,
  modId: string,
): Promise<Session> {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, modId }),
  });
  return res.json();
}

export async function fetchSession(id: string): Promise<Session> {
  const res = await fetch(`${API_BASE}/sessions/${id}`);
  return res.json();
}

export async function terminateSession(id: string): Promise<void> {
  await fetch(`${API_BASE}/sessions/${id}`, { method: "DELETE" });
}
