import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./main.js";
import { eventApi } from "./api/event.api.js";
import { imageApi } from "./api/image.api.js";
import { mediaApi } from "./api/media.api.js";
import { placeApi } from "./api/place.api.js";
import { ticketApi } from "./api/ticket.api.js";
import { userApi } from "./api/user.api.js";
import { auth } from "./lib/auth.js";

// sækjum PORT úr umhverfisbreytu eða notum 3000 sem sjálfgefið gildi
const port = Number(process.env.PORT) || 3000;

app.on(["GET", "POST"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.route("/events", eventApi);
app.route("/image", imageApi);
app.route("/media", mediaApi);
app.route("/place", placeApi);
app.route("/ticket", ticketApi);
app.route("/user", userApi);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
