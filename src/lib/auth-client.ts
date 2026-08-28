"use client";

import { createAuthClient } from "better-auth/react";

// No baseURL: better-auth defaults to the current origin, which is what we
// want in the browser (https in prod, localhost in dev). The old
// "http://graycup.in" fallback forced insecure http and broke sessions
// whenever NEXT_PUBLIC_APP_URL was unset at build time.
export const authClient = createAuthClient();

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
