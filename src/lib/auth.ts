import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { user, session, account, verification } from "./schema";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:6969",
  secret: process.env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
        input: true,
      },
      lastName: {
        type: "string",
        required: false,
        input: true,
      },
      phone: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
  trustedOrigins: [
    "https://graycup.in",
    "http://localhost:6969",
  ],
});

export type Session = typeof auth.$Infer.Session;
