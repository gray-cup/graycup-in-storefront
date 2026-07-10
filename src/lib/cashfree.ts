// Shared Cashfree API helpers — import from here, not inline in routes.
// All routes should use CF_BASE, CF_VERSION, and cfHeaders().

export const CF_VERSION = "2023-08-01";

export const CF_BASE =
  process.env.CASHFREE_MODE === "sandbox"
    ? "https://sandbox.cashfree.com/pg"
    : "https://api.cashfree.com/pg";

export function cfHeaders(extra: Record<string, string> = {}): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-client-id": process.env.CASHFREE_CLIENT_ID!,
    "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
    "x-api-version": CF_VERSION,
    ...extra,
  };
}

// ── Subscriptions (/plans, /subscriptions) ──────────────────────────────────
// Subscriptions use a newer api-version than one-off orders/links.
export const CF_SUBSCRIPTION_VERSION = "2025-01-01";

export function cfSubscriptionHeaders(
  extra: Record<string, string> = {},
): HeadersInit {
  return cfHeaders({ "x-api-version": CF_SUBSCRIPTION_VERSION, ...extra });
}

// Cashfree subscription_status values:
// INITIALIZED | ACTIVE | ON_HOLD | COMPLETED | CANCELLED | EXPIRED
export function mapSubscriptionStatus(
  cfStatus: string,
): "pending" | "active" | "paused" | "ended" {
  switch (cfStatus) {
    case "ACTIVE":
      return "active";
    case "ON_HOLD":
      return "paused";
    case "COMPLETED":
    case "CANCELLED":
    case "EXPIRED":
      return "ended";
    case "INITIALIZED":
    default:
      return "pending";
  }
}

// ── Order status → internal payment status ─────────────────────────────────
// Cashfree order_status values: ACTIVE | PAID | EXPIRED | TERMINATED | TERMINATION_REQUESTED
// Cashfree payment_status values: SUCCESS | FAILED | PENDING | NOT_ATTEMPTED | USER_DROPPED | FLAGGED | CANCELLED | VOID
export function mapOrderStatus(cfStatus: string): "paid" | "pending" | "failed" {
  switch (cfStatus) {
    case "PAID":
      return "paid";
    case "EXPIRED":
    case "TERMINATED":
    case "TERMINATION_REQUESTED":
      return "failed";
    case "ACTIVE":
    default:
      return "pending";
  }
}

export function mapPaymentStatus(cfStatus: string): "paid" | "pending" | "failed" {
  switch (cfStatus) {
    case "SUCCESS":
      return "paid";
    case "FAILED":
    case "CANCELLED":
    case "VOID":
      return "failed";
    case "USER_DROPPED":
    case "PENDING":
    case "NOT_ATTEMPTED":
    case "FLAGGED":
    default:
      return "pending";
  }
}
