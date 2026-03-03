import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./main.js";
// sækjum PORT úr umhverfisbreytu eða notum 3000 sem sjálfgefið gildi
const port = Number(process.env.PORT) || 3000;
serve({
    fetch: app.fetch,
    port,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
