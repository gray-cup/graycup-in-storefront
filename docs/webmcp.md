# WebMCP on the Gray Cup storefront

This storefront exposes a set of **WebMCP tools** to any AI agent connected to
the browser tab. An agent (Claude in Chrome, an agentic browser, a Claude Code
session driving Chrome via `chrome-devtools-mcp`) can search the catalogue, run
the coffee finder, and build the cart through typed tool calls instead of
scraping the DOM. When a tool mutates the cart, the normal React UI updates
live because the tools go through the same `useCart()` context the site uses.

WebMCP makes an agent **effective once it is on the page**. It is not a
discovery / SEO mechanism — it does nothing for how Gray Cup ranks when
someone asks an assistant "best filter coffee in India". Think of it as
accessibility for agents.

## What was added

| File | Purpose |
|------|---------|
| `src/components/webmcp-tools.tsx` | All tool registrations. Renders `null`. |
| `src/lib/webmcp-cart-bridge.ts` | Module-level `cartBridge` / `navBridge` refs so tool `execute` callbacks never close over React state. |
| `src/components/cart-provider.tsx` | One `useEffect` keeps `cartBridge.current` pointed at the live context value. |
| `src/components/providers.tsx` | Mounts `<WebMCPTools />` once, inside `<CartProvider>`. |
| `.mcp.json` | Connects a local Claude Code session to Chrome for testing. |
| `use-webmcp-tool` (dep) | `useWebMCP` hook — handles `document.modelContext` registration, StrictMode double-mount, and unmount abort. |

Nothing else in the app changed. There is no new server route — the cart is
client-only (`localStorage`), and `apply_coupon` reuses the existing
`POST /api/validate-coupon`.

## The tools

| Tool | Writes | What it does |
|------|:------:|--------------|
| `search_products` | – | Filter the retail catalogue by free text and/or category (Tea / Coffee / Matcha / Accessories). |
| `get_product_details` | – | Full sheet for one slug: long description, roast/process, every variant + price, page URL. |
| `recommend_coffee` | – | Runs the site's coffee-finder engine (`src/lib/coffee-quiz.ts`). Returns a pick + alternatives + reasons + brew note. |
| `get_cart` | – | Current lines (variant, grind, qty), total, checkout URL. |
| `add_to_cart` | ✎ | Add a product; resolves `variant` by name, optional `grind`, optional `quantity`. |
| `update_cart_quantity` | ✎ | Set a line's quantity; `0` removes it. |
| `remove_from_cart` | ✎ | Remove a line by `slug` (+ `variant` if ambiguous). |
| `apply_coupon` | ✎ | Validates a code against the cart; on success saves it so checkout auto-applies it. |
| `go_to_checkout` | ✎ | Navigates to `/checkout`. Does **not** place an order — address + payment are still manual. |

All tools are available logged-out (the cart is anonymous). There is
deliberately no `place_order` tool — checkout requires the buyer to enter their
address and pay through Cashfree.

## Key implementation rule

`use-webmcp-tool` registers each tool once and **does not re-register when the
`execute` function changes**. So `execute` callbacks must not close over React
state / props. Instead they read everything through:

- the static product data (`@/data/products`) — pure, never changes;
- `cartBridge.current` — the live `useCart()` value, refreshed each render by
  a `useEffect` in `CartProvider`;
- `navBridge.current` — the router's `navigate`, set by a `useEffect` in
  `WebMCPTools`.

After a mutation, tools `await settle()` (a 30 ms tick) before returning a cart
snapshot, so the response reflects the state update React just scheduled.

## Testing it locally

### 1. Chrome with WebMCP enabled

- Chrome 149+ (151+ recommended).
- `chrome://flags/#enable-webmcp-testing` → **Enabled** → Relaunch
  (or launch with `--enable-features=WebMCP`).
- Sanity check in DevTools console on any page: `'modelContext' in document` → `true`.
- Optional: the [Model Context Tool Inspector](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd)
  extension shows the registered tools live.

### 2. Run the storefront

```bash
npm install --legacy-peer-deps
npm run dev
```

Open the dev URL in the flagged Chrome. The tools register on every page (they
are mounted in the root providers).

### 3. Connect an agent

**Claude Code:** `.mcp.json` in this repo already points at
`chrome-devtools-mcp`. Start Claude Code from the repo root, approve the
`chrome-devtools` MCP server, keep the storefront tab focused, and set
`execute_webmcp_tool` to "always allow".

**Claude Desktop / Claude in Chrome:** use the built-in browser connection; the
tools appear automatically for the focused tab.

### 4. Try it

> "I drink my coffee black, mostly for the taste, and I like it chocolatey and
> not too bitter. Find me something and add a 250g bag to the cart."

Expected trace: `recommend_coffee` → `get_product_details` →
`add_to_cart({ slug: "...", variant: "250g" })`. The cart badge in the navbar
updates on its own.

> "Apply code GRAYCUP10 and take me to checkout."

Expected: `apply_coupon` → `go_to_checkout`.

## Production notes

- The tools ship to production but are inert in browsers without WebMCP, which
  is currently the vast majority. `useWebMCP` returns `supported: false` and
  registers nothing.
- No secrets are exposed — every tool calls the same code paths a normal user
  can already reach.
- If the coffee-finder recommendations or product catalogue change, the tools
  follow automatically; they read the same modules the UI does.
- To add a visible "N WebMCP tools" badge (like the reference
  `webmcp-espresso-store` demo has), collect the `{ supported, registered }`
  return values from each `useWebMCP` call and render a small fixed-position
  element. Skipped for now — add if you want the affordance.
