import dotenv from "dotenv";
import assert from "node:assert";
import { describe, it } from "node:test";
import { PrismaClient } from "../../src/generated/prisma/index.js";
import { after } from "node:test";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({ quiet: true });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

after(async () => {
  await prisma.session.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.image.deleteMany();
  await prisma.media.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.place.deleteMany();
});

describe("User endpoint tests", () => {
  describe("Unauthorized User", () => {
    describe("Post", () => {
      it("should fail due to authorization", async () => {
        const users = await prisma.user.findMany();

        const expected = {
          error: "Unauthorized",
        };

        assert.deepStrictEqual(users, expected);
      });
    });
  });
});
