import { Elysia, t } from "elysia";
import type { Session } from "@moondark/types";

const sessions = new Map<string, Session>();

export const sessionRoutes = new Elysia({ prefix: "/sessions" })
  .post(
    "",
    ({ body }) => {
      const id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const session: Session = {
        id,
        userId: body.userId,
        modId: body.modId,
        status: "pending",
        startedAt: new Date().toISOString(),
      };
      sessions.set(id, session);

      setTimeout(() => {
        const s = sessions.get(id);
        if (s) {
          s.status = "running";
          sessions.set(id, s);
        }
      }, 2000);

      return session;
    },
    {
      body: t.Object({
        userId: t.String(),
        modId: t.String(),
      }),
    },
  )
  .get("/:id", ({ params }) => {
    const session = sessions.get(params.id);
    if (!session) {
      return new Response("Session not found", { status: 404 });
    }
    return session;
  })
  .delete("/:id", ({ params }) => {
    const session = sessions.get(params.id);
    if (!session) {
      return new Response("Session not found", { status: 404 });
    }
    session.status = "stopped";
    session.endedAt = new Date().toISOString();
    sessions.set(params.id, session);
    return { success: true, session };
  })
  .get("", () => Array.from(sessions.values()));
