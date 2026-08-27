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

    // Everything this handler returns is dynamic SSR — HTML documents and
    // loader/action data. None of it may be cached: a stale document embeds
    // content-hashed asset URLs that 404 after the next deploy (unstyled page,
    // gray flashes), and stale loader data is just wrong. Static assets are
    // served by the ASSETS binding, not here, so this never touches them.
    // A route that genuinely wants caching can still set its own header.
    if (!response.headers.has("Cache-Control")) {
      response.headers.set("Cache-Control", "no-store");
    }

    return response;
  },
} satisfies ExportedHandler<Env>;
