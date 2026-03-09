import assert from "node:assert";
import { describe, it, before } from "node:test";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const URL = "http://localhost:3000";
let authCookie: string;

before(async () => {
  const res = await fetch(`${URL}/api/auth/sign-in/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: URL,
    },
    body: JSON.stringify({
      email: "admin@example.org",
      password: "admin12345",
    }),
  });

  const rawCookies = res.headers.getSetCookie();
  const sessionCookie = rawCookies.find((c) =>
    c.includes("better-auth.session_token"),
  );

  if (sessionCookie) {
    authCookie = sessionCookie.split(";")[0];
  }

  assert.ok(authCookie, "Login fail");
});

describe("api endpoint tests", () => {
  describe("GET /user", () => {
    it("should not pass without authorization", async () => {
      const req = await fetch(`${URL}/user`);
      assert.strictEqual(req.status, 401);
    });

    it("should pass with authorization", async () => {
      const req = await fetch(`${URL}/user`, {
        headers: { Cookie: authCookie },
      });
      assert.strictEqual(req.status, 200);
    });
  });

  describe("POST /ticket", () => {
    it("should pass without authorization", async () => {
      const event = await prisma.event.findFirst();
      const user = await prisma.user.findFirst();

      const res = await fetch(`${URL}/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event?.id, userId: user?.id }),
      });
      assert.strictEqual(res.status, 201);
    });
  });

  describe("PUT /media", () => {
    it("should pass with authorization", async () => {
      const media = await prisma.media.findFirst();
      const res = await fetch(`${URL}/media/${media?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Cookie: authCookie },
        body: JSON.stringify({
          facebook: "fb.com/updated",
          website: "updated.is",
        }),
      });
      assert.strictEqual(res.status, 200);
    });
  });
  describe("GET /events/:id", () => {
    it("should pass without authorization", async () => {
      const event = await prisma.event.findFirst();
      const res = await fetch(`${URL}/events/${event?.id}`);
      assert.strictEqual(res.status, 200);
    });
  });
});
