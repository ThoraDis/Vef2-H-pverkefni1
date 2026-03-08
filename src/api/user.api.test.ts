import assert from "node:assert";
import { describe, it } from "node:test";
import { prisma } from "../../src/generated/prisma/index.js";
import { after } from "node:test";

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
