import { Elysia } from "elysia";
import { healthRoutes } from "./routes/health";
import { modRoutes } from "./routes/mods";
import { sessionRoutes } from "./routes/sessions";
import { signalingRoutes } from "./routes/signaling";
import { inputRoutes } from "./routes/input";

const app = new Elysia()
  .get("/", () => ({ name: "Moondark API", version: "0.0.0" }))
  .use(healthRoutes)
  .use(modRoutes)
  .use(sessionRoutes)
  .use(signalingRoutes)
  .use(inputRoutes)
  .listen(3001);

console.log(`Moondark API running at ${app.server?.url}`);
