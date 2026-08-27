---
name: webmcp-storefront
description: >-
  Add or maintain WebMCP tools on a React storefront so browser AI agents can
  search the catalogue and drive the cart through typed calls instead of DOM
  scraping. Use when asked to "add WebMCP", "expose tools to the agent", "make
  the store agent-usable", wire up document.modelContext, or extend/debug the
  existing webmcp-tools.tsx. Covers the no-stale-closure bridge pattern, mount
  point, .mcp.json, and Chrome testing.
---

# WebMCP on a storefront

WebMCP lets an AI agent connected to the browser tab call typed tools
(`add_to_cart`, `search_products`, …) that run the same code paths the UI uses,
so the React UI updates live. It makes an agent **effective once it is on the
page** — it is not discovery/SEO.

Reference implementation: `graycup-in-storefront` —
`src/components/webmcp-tools.tsx`, `src/lib/webmcp-cart-bridge.ts`,
`docs/webmcp.md`. The public demo it was modelled on is
`webmcp-espresso-store/` (Wasp; server-op flavour).

## The one rule that bites

`use-webmcp-tool`'s `useWebMCP` registers each tool **once** and does **not**
re-register when `execute` changes. So `execute` callbacks must never close
over React state, props, or context values — they will be stale forever.

Read live state through, in order of preference:

1. **Static module data** (product arrays, pure helpers) — never changes, import directly.
2. **A module-level bridge ref** updated every render by a `useEffect` in the provider that owns the state.
3. **A module-level nav ref** (`navigate`) set by a `useEffect` in the tools component.

## Procedure to add it to a new storefront

1. **Install:** `npm i use-webmcp-tool@^0.2.0` (add `--legacy-peer-deps` if the
   repo already needs it).

2. **Bridge module** — `src/lib/webmcp-cart-bridge.ts`:

   ```ts
   import type { useCart } from "@/components/cart-provider";
   import type { NavigateFunction } from "react-router";
   export const cartBridge: { current: ReturnType<typeof useCart> | null } = { current: null };
   export const navBridge: { current: NavigateFunction | null } = { current: null };
   ```

3. **Feed the bridge** — in the cart/state provider, build the context value as
   a named `const value` and add:

   ```ts
   useEffect(() => { cartBridge.current = value; });  // no dep array
   ```

4. **Tools component** — `src/components/webmcp-tools.tsx`, renders `null`:
   - Top-of-file `unhandledrejection` handler swallowing `use-webmcp-tool`
     `AbortError`s (expected unmount noise — see reference file).
   - `useEffect(() => { navBridge.current = navigate; }, [navigate])`.
   - One `useWebMCP({ name, description, inputSchema, annotations, execute })`
     per tool. `annotations: { readOnlyHint: true }` for reads,
     `{ readOnlyHint: false }` for writes.
   - `execute` reads `cartBridge.current` / static data only. After a mutation,
     `await new Promise(r => setTimeout(r, 30))` before returning a cart
     snapshot so it reflects the scheduled state update.
   - Throw `Error` with a helpful message for bad input (unknown slug/variant);
     the agent sees it.

5. **Mount once** — inside the cart provider, in the root providers component:
   `<WebMCPTools />`. Must be within the Router context (root layout is fine).

6. **`.mcp.json`** at repo root for local agent testing:

   ```json
   { "mcpServers": { "chrome-devtools": { "command": "npx", "args": ["-y", "chrome-devtools-mcp@latest", "--categoryExperimentalWebmcp", "--autoConnect", "--no-usage-statistics"] } } }
   ```

7. **Guide** — copy `docs/webmcp.md` and adjust the tool table.

## Tool set (baseline)

`search_products`, `get_product_details`, `get_cart`, `add_to_cart`,
`update_cart_quantity`, `remove_from_cart`, `apply_coupon` (reuse the existing
coupon-validation route; on success write the same `localStorage` key checkout
reads), `go_to_checkout` (navigate only). Add domain tools like
`recommend_coffee` by wrapping an existing pure engine.

**Never** add a `place_order` / `checkout` tool that completes payment. Checkout
stays manual (address + payment). `go_to_checkout` just navigates.

## Constraints

- All tools are SSR-safe: `use-webmcp-tool` guards every `document.modelContext`
  access inside `useEffect`. The component renders `null` on the server.
- Tools ship to production but are inert where WebMCP is unsupported
  (`useWebMCP` returns `supported: false`).
- No secrets, no privileged paths — a tool may only do what an anonymous user
  can already do in the UI.
- If catalogue/recommendation logic changes, tools follow automatically because
  they import the same modules the UI does. Keep it that way — no forked data.

## Testing

- Chrome 149+ with `chrome://flags/#enable-webmcp-testing` → Enabled → relaunch
  (or `--enable-features=WebMCP`). Verify: `'modelContext' in document` → `true`.
- `npm run dev`, open in flagged Chrome, start Claude Code from repo root,
  approve the `chrome-devtools` MCP server, keep the store tab focused, set
  `execute_webmcp_tool` to always-allow.
- Smoke prompt: *"Recommend a coffee for someone who drinks it black and likes
  it chocolatey, then add a 250g bag."* → `recommend_coffee` →
  `get_product_details` → `add_to_cart`; navbar cart badge updates on its own.
- `npx tsc -b` — confirm zero **new** errors in the added files (these repos
  have pre-existing unrelated `tsc` noise).
