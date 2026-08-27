import {
  RouterContextProvider,
  createRequestHandler,
} from "react-router";
import { cloudflareContext } from "@/lib/cloudflare-context";

export { cloudflareContext };

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

// Requests for files under /public are served directly by the Workers
// Static Assets binding (see wrangler.jsonc `assets`) and their Cache-Control
// headers come from `public/_headers`, not from here. This handler only ever
// sees requests that fall through to SSR (documents + resource routes).
export default {
  async fetch(request, env, ctx) {
    const routerContext = new RouterContextProvider();
    routerContext.set(cloudflareContext, { env, ctx });

    const response = await requestHandler(request, routerContext);

    if (!response.headers.has("Cache-Control")) {
      // HTML documents reference content-hashed asset URLs that are deleted on
      // the next deploy — serving a stale document 404s its CSS/JS. Documents
      // must always revalidate; only non-document SSR responses get cached.
      const isDocument = response.headers
        .get("Content-Type")
        ?.includes("text/html");
      response.headers.set(
        "Cache-Control",
        isDocument
          ? "public, max-age=0, must-revalidate"
          : "public, max-age=3600, stale-while-revalidate=86400",
      );
    }

    return response;
  },
} satisfies ExportedHandler<Env>;
