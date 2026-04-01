export interface Session {
  id: string;
  userId: string;
  modId: string;
  status: "pending" | "running" | "stopped" | "error";
  startedAt?: string;
  endedAt?: string;
}
