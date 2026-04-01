export interface Mod {
  id: string;
  name: string;
  description: string;
  version: string;
  game: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  modId: string;
  status: "pending" | "running" | "stopped" | "error";
  startedAt?: string;
  endedAt?: string;
  iceServers?: RTCIceServer[];
}

export interface WebRTCOffer {
  sdp: string;
  type: RTCSdpType;
}

export interface WebRTCAnswer {
  sdp: string;
  type: RTCSdpType;
}

export interface IceCandidate {
  candidate: string;
  sdpMid: string;
  sdpMLineIndex: number;
}

export interface InputEvent {
  sessionId: string;
  type: "touch" | "button" | "axis";
  data: Record<string, unknown>;
  timestamp: number;
}

export interface User {
  id: string;
  email: string;
  subscriptionStatus: "active" | "inactive" | "cancelled";
  createdAt: string;
}

export interface HealthResponse {
  status: "ok";
  uptime: number;
  timestamp: string;
}
