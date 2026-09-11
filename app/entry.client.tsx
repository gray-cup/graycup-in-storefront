import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import posthog from "posthog-js";
import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";

const projectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const host = import.meta.env.VITE_POSTHOG_HOST;

if (!projectToken || !host) {
  if (import.meta.env.DEV) {
    const missingVariable = !projectToken
      ? "VITE_POSTHOG_PROJECT_TOKEN"
      : "VITE_POSTHOG_HOST";
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  posthog.init(projectToken, {
    api_host: host,
    defaults: "2026-05-30",
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      {projectToken && host ? (
        <PostHogProvider client={posthog}>
          <PostHogErrorBoundary>
            <HydratedRouter />
          </PostHogErrorBoundary>
        </PostHogProvider>
      ) : (
        <HydratedRouter />
      )}
    </StrictMode>,
  );
});
