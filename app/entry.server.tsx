import type { EntryContext, RouterContextProvider } from "react-router";
import { ServerRouter, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

export const streamTimeout = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: RouterContextProvider,
) {
  // https://httpwg.org/specs/rfc9110.html#HEAD
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  }

  let shellRendered = false;
  let userAgent = request.headers.get("user-agent");

  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: AbortSignal.timeout(streamTimeout + 1000),
      onError(error: unknown) {
        responseStatusCode = 500;
        if (shellRendered) {
          console.error(error);
        }
      },
    },
  );
  shellRendered = true;

  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

// Default entry.server logs every non-aborted error to console, which Workers
// records as level:error. Most of our volume is noise we can't act on:
//  - 4xx route errors (bot 404s, 405 from POSTing render-only routes)
//  - "Network connection lost" — transient Cloudflare subrequest drop / client
//    hanging up mid-stream
// Drop those; log everything else (real 5xx, thrown bugs).
export function handleError(error: unknown, { request }: { request: Request }) {
  if (request.signal.aborted) return;
  if (isRouteErrorResponse(error) && error.status < 500) return;
  const msg = error instanceof Error ? error.message : "";
  if (msg === "Network connection lost" || /aborted|cancell?ed/i.test(msg)) return;
  console.error(error);
}
