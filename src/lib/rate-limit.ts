import type { RouterContextProvider } from "react-router";
import { cloudflareContext } from "./cloudflare-context";

type Bucket = "checkout" | "subscription" | "coupon" | "review" | "contact" | "refund";

// Which Cloudflare rate-limit binding each bucket uses (see wrangler.jsonc).
const BINDING: Record<Bucket, "API_RATE_LIMITER" | "STRICT_RATE_LIMITER"> = {
  checkout: "API_RATE_LIMITER",
  subscription: "API_RATE_LIMITER",
  coupon: "API_RATE_LIMITER",
  refund: "API_RATE_LIMITER",
  review: "STRICT_RATE_LIMITER",
  contact: "STRICT_RATE_LIMITER",
};

/**
 * Per-IP rate limit for a custom API route. Returns a 429 Response when the
 * caller is over the limit, or null to proceed. Fails open if the binding is
 * missing (local dev, tests) so nothing breaks off Cloudflare.
 *
 *   const limited = await rateLimit(context, request, "checkout");
 *   if (limited) return limited;
 */
export async function rateLimit(
  context: Readonly<RouterContextProvider>,
  request: Request,
  bucket: Bucket,
): Promise<Response | null> {
  const limiter = context.get(cloudflareContext)?.env?.[BINDING[bucket]];
  if (!limiter) return null;

  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const { success } = await limiter.limit({ key: `${bucket}:${ip}` });
  if (success) return null;

  return Response.json(
    { error: "Too many requests. Please wait a minute and try again." },
    { status: 429, headers: { "Retry-After": "60" } },
  );
}
