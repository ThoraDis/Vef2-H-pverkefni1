import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../db/client.js";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL, // e.g. http://localhost:4000
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  trustedOrigins: [
    "http://localhost:3000",
    "https://vef2-2026-h2-git-dagur-valurks-projects.vercel.app",
    "https://vef2-2026-h2.vercel.app",
    "https://h2.valur.me",
    "https://*.vercel.app",
  ],

  advanced: {
    useSecureCookies: true,
    crossSubdomainCookies: {
      enabled: true,
      domain: ".valur.me",
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      domain: ".valur.me",
    },
  },

  emailAndPassword: {
    enabled: true,
  },
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
