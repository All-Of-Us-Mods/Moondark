import { Elysia, t } from "elysia";
import type { Mod } from "@moondark/types";

const MOCK_MODS: Mod[] = [
  {
    id: "mod-1",
    name: "Enhanced Graphics Overhaul",
    description: "Complete visual overhaul with ray tracing and 4K textures",
    version: "2.1.0",
    game: "Skyrim",
    createdAt: "2026-03-15T00:00:00Z",
  },
  {
    id: "mod-2",
    name: "Unlimited Build System",
    description: "Remove all settlement build limits and add new structures",
    version: "1.4.2",
    game: "Fallout 4",
    createdAt: "2026-03-10T00:00:00Z",
  },
  {
    id: "mod-3",
    name: "AI Companions+",
    description: "Smart AI companions with dynamic dialogue and quests",
    version: "3.0.0",
    game: "Skyrim",
    createdAt: "2026-03-01T00:00:00Z",
  },
];

export const modRoutes = new Elysia({ prefix: "/mods" })
  .get("", () => MOCK_MODS)
  .get("/:id", ({ params }) => {
    const mod = MOCK_MODS.find((m) => m.id === params.id);
    if (!mod) {
      return new Response("Mod not found", { status: 404 });
    }
    return mod;
  });
