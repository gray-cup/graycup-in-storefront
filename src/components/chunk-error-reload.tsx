"use client";

import { useEffect } from "react";

// After a new deploy, a browser tab left open still references the old
// build's chunk file hashes. Once those old chunks are gone from the
// server, any lazy-loaded import fails with "Failed to load chunk ...".
// Reloading the page fetches the current build and fixes it - this just
// does that automatically instead of leaving the user on a broken page.
const RELOAD_FLAG_KEY = "graycup_chunk_reload";
const CHUNK_ERROR_PATTERN = /Failed to load chunk|ChunkLoadError|Loading chunk .* failed/i;

function handleChunkError(message: string | undefined) {
  if (!message || !CHUNK_ERROR_PATTERN.test(message)) return;

  // Guard against a reload loop if the failure isn't actually fixed by reloading.
  if (sessionStorage.getItem(RELOAD_FLAG_KEY)) return;
  sessionStorage.setItem(RELOAD_FLAG_KEY, "1");
  window.location.reload();
}

export function ChunkErrorReload() {
  useEffect(() => {
    // Reaching this point means the page mounted successfully - clear the
    // guard so a chunk error from a *future* deploy can still trigger a reload.
    sessionStorage.removeItem(RELOAD_FLAG_KEY);

    const onError = (event: ErrorEvent) => handleChunkError(event.message);
    const onRejection = (event: PromiseRejectionEvent) =>
      handleChunkError(event.reason?.message ?? String(event.reason));

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
