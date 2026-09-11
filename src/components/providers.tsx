"use client";

import React, { useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";
import { CartProvider } from "@/components/cart-provider";
import { WebMCPTools } from "@/components/webmcp-tools";
import { Toaster } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";

const isPostHogConfigured = Boolean(
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST,
);

interface RootProvidersProps {
  children: React.ReactNode;
}

function PostHogIdentity() {
  const posthog = usePostHog();
  const { data: session, isPending } = authClient.useSession();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isPostHogConfigured || isPending) return;

    const user = session?.user;
    if (!user) {
      if (identifiedUserId.current) {
        posthog.reset();
        identifiedUserId.current = null;
      }
      return;
    }

    if (identifiedUserId.current === user.id) return;

    if (identifiedUserId.current) {
      posthog.reset();
    }

    posthog.identify(user.id, {
      email: user.email,
      name: user.name,
    });
    identifiedUserId.current = user.id;
  }, [isPending, posthog, session?.user]);

  return null;
}

export default function RootProviders({ children }: RootProvidersProps) {
  return (
    <CartProvider>
      <PostHogIdentity />
      {children}
      <WebMCPTools />
      <Toaster />
    </CartProvider>
  );
}
