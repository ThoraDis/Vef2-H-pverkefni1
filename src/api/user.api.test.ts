import assert from "node:assert";
import { describe, it } from "node:test";
import { prisma } from "../prisma.js";

describe("User endpoint tests", () => {
  describe("Unauthorized User", () => {
    describe("Post", () => {
      it("should fail due to authorization", async () => {
        const users = await prisma.user.findMany();

        const expected = {
          error: "Unauthorized",
        };

        assert.strictEqual(users, expected);
      });
    });
  });
});
