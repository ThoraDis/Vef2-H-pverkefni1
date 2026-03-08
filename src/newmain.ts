import { Hono } from "hono";
import auth from "./routes/auth.js";
import type { AuthType } from "./lib/auth.js";

export const app = new Hono<{ Variables: AuthType }>({
  strict: false,
});

const routes = [auth];
const api = app.basePath("/api");
routes.forEach((route) => api.route("/", route));
