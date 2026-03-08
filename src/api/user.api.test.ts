import dotenv from "dotenv";
import assert from "node:assert";
import { describe, it, after } from "node:test";

import { PrismaClient } from "../generated/prisma"; 

dotenv.config({ quiet: true });

export const prisma = new PrismaClient();

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
