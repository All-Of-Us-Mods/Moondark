import { Elysia, t } from "elysia";

const SIGNALING_URL = process.env.SIGNALING_URL || "http://localhost:3002";

export const inputRoutes = new Elysia({ prefix: "/input" })
  .post(
    "",
    async ({ body }) => {
      await fetch(`${SIGNALING_URL}/input`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return { success: true };
    },
    {
      body: t.Object({
        sessionId: t.String(),
        type: t.String(),
        data: t.Record(t.String(), t.Unknown()),
        timestamp: t.Number(),
      }),
    },
  );
