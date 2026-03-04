import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { jwt, username } from "better-auth/plugins";
import { prisma } from "../db/client.js";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL, // e.g. http://localhost:4000
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  trustedOrigins: ["http://localhost:3000"],

  emailAndPassword: {
    enabled: true,
  },

  plugins: [username(), jwt()],
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
