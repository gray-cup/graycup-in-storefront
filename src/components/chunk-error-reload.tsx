"use client";

import { useEffect } from "react";

// After a new deploy, a browser tab left open still references the old
// build's chunk file hashes. Once those old chunks are gone from the
// server, any lazy-loaded import fails with "Failed to load chunk ...".
// Reloading the page fetches the current build and fixes it - this just
// does that automatically instead of leaving the user on a broken page.
const RELOAD_FLAG_KEY = "graycup_chunk_reload";
const CHUNK_ERROR_PATTERN = /Failed to load chunk|ChunkLoadError|Loading chunk .* failed/i;
// If a reload doesn't fix the chunk error (broken/incomplete deploy), don't
// reload again for this long - otherwise every click becomes a reload loop.
const RELOAD_COOLDOWN_MS = 60_000;

function handleChunkError(message: string | undefined) {
  if (!message || !CHUNK_ERROR_PATTERN.test(message)) return;

  const last = Number(sessionStorage.getItem(RELOAD_FLAG_KEY) ?? 0);
  if (Date.now() - last < RELOAD_COOLDOWN_MS) return;
  sessionStorage.setItem(RELOAD_FLAG_KEY, String(Date.now()));
  window.location.reload();
}

export function ChunkErrorReload() {
  useEffect(() => {
    // Page mounted fine. Clear the guard only once the cooldown has elapsed, so
    // a still-broken deploy can't turn every navigation into a reload loop.
    const last = Number(sessionStorage.getItem(RELOAD_FLAG_KEY) ?? 0);
    if (Date.now() - last >= RELOAD_COOLDOWN_MS) {
      sessionStorage.removeItem(RELOAD_FLAG_KEY);
    }

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
