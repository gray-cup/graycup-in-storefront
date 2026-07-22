"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:6969",
});

// Convenience re-exports
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
} = authClient;

// Typed user that includes our additional fields
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  firstName: string;
  lastName?: string | null;
  phone: string;
};
