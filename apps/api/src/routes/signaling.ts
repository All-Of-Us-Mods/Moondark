import { Elysia, t } from "elysia";
import type { WebRTCOffer, WebRTCAnswer, IceCandidate } from "@moondark/types";

const SIGNALING_URL = process.env.SIGNALING_URL || "http://localhost:3002";

export const signalingRoutes = new Elysia({ prefix: "/webrtc" })
  .post(
    "/offer",
    async ({ body }) => {
      const response = await fetch(`${SIGNALING_URL}/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const answer = (await response.json()) as WebRTCAnswer;
      return answer;
    },
    {
      body: t.Object({
        sessionId: t.String(),
        offer: t.Object({
          sdp: t.String(),
          type: t.String(),
        }),
      }),
    },
  )
  .post(
    "/ice",
    async ({ body }) => {
      await fetch(`${SIGNALING_URL}/ice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return { success: true };
    },
    {
      body: t.Object({
        sessionId: t.String(),
        candidate: t.Object({
          candidate: t.String(),
          sdpMid: t.String(),
          sdpMLineIndex: t.Number(),
        }),
      }),
    },
  );
