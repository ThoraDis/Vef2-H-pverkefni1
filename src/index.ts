import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { eventApi } from "./api/event.api.js";
import { imageApi } from "./api/image.api.js";
import { mediaApi } from "./api/media.api.js";
import { placeApi } from "./api/place.api.js";
import { ticketApi } from "./api/ticket.api.js";
import { userApi } from "./api/user.api.js";

import type { AuthType } from "./lib/auth.js";
import auth from "./routes/auth.js";
import { auth as betterAuth } from "./lib/auth.js";
import { serveStatic } from "@hono/node-server/serve-static";

const port = Number(process.env.PORT) || 3000;

export const app = new Hono<{ Variables: AuthType }>({
  strict: false,
});

const routes = [auth];
const api = app.basePath("/api");
routes.forEach((route) => api.route("/", route));

// sendir út allt sem er í static möppunni
app.use("/*", serveStatic({ root: "./static" }));

app.on(["GET", "POST"], "/api/auth/*", (c) => {
  return betterAuth.handler(c.req.raw);
});

app.route("/events", eventApi);
app.route("/image", imageApi);
app.route("/media", mediaApi);
app.route("/place", placeApi);
app.route("/ticket", ticketApi);
app.route("/user", userApi);

app.get("/", (c) => {
  return c.json({
    "/api/auth/sign-up/email": [
      {
        method: "POST",
        description: "Create user (búa til nýjan notanda)",
        body: {
          email: "admin@example.org",
          password: "Test12345678",
          name: "User One",
        },
      },
    ],
    "/api/auth/sign-in/email": [
      {
        method: "POST",
        description: "Sign in (skrá inn notanda)",
      },
    ],
    "/events": [
      {
        method: "GET",
        description: "ná í alla events",
      },
      {
        method: "POST",
        description: "búa til event",
      },
    ],
    "/events/:id": [
      {
        method: "GET",
        description: "ná í event eftir id",
      },
      {
        method: "DELETE",
        description: "eyða event eftir id",
      },
      {
        method: "PUT",
        description: "uppfæra event eftir id",
      },
    ],
    "/image": [
      {
        method: "GET",
        description: "ná í alla image",
      },
      {
        method: "POST",
        description: "búa til image",
      },
    ],
    "/image/:id": [
      {
        method: "GET",
        description: "ná í image eftir id",
      },
      {
        method: "DELETE",
        description: "eyða image eftir id",
      },
      {
        method: "PUT",
        description: "uppfæra image eftir id",
      },
    ],
    "/media": [
      {
        method: "GET",
        description: "ná í alla media",
      },
      {
        method: "POST",
        description: "búa til media",
      },
    ],
    "/media/:id": [
      {
        method: "GET",
        description: "ná í media eftir id",
      },
      {
        method: "DELETE",
        description: "eyða media eftir id",
      },
      {
        method: "PUT",
        description: "uppfæra media eftir id",
      },
    ],
    "/place": [
      {
        method: "GET",
        description: "ná í alla place",
      },
      {
        method: "POST",
        description: "búa til place",
      },
    ],
    "/place/:id": [
      {
        method: "GET",
        description: "ná í place eftir id",
      },
      {
        method: "DELETE",
        description: "eyða place eftir id",
      },
      {
        method: "PUT",
        description: "uppfæra place eftir id",
      },
    ],
    "/ticket": [
      {
        method: "GET",
        description: "ná í alla ticket",
      },
      {
        method: "POST",
        description: "búa til ticket",
      },
    ],
    "/ticket/:id": [
      {
        method: "GET",
        description: "ná í ticket eftir id",
      },
      {
        method: "DELETE",
        description: "eyða ticket eftir id",
      },
      {
        method: "PUT",
        description: "uppfæra ticket eftir id",
      },
    ],
    "/user": [
      {
        method: "GET",
        description: "ná í alla user",
      },
      {
        method: "POST",
        description: "búa til user",
      },
    ],
    "/user/:id": [
      {
        method: "GET",
        description: "ná í user eftir id",
      },
      {
        method: "DELETE",
        description: "eyða user eftir id",
      },
      {
        method: "PUT",
        description: "uppfæra user eftir id",
      },
    ],
  });
});

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
