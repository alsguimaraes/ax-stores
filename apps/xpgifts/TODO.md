# TODO: Replace Mock Data with WooCommerce REST API v3

## Context

All product/category/order/address/etc. data currently comes from static arrays in `src/lib/data/*.ts`, added during the initial route-scaffolding pass. Every accessor (`getProducts()`, `getProductBySlug()`, etc.) was deliberately kept synchronous and side-effect-free so swapping the implementation wouldn't require touching call sites. This doc plans that swap: replacing those accessors with live calls to a WooCommerce store's REST API v3, since [xpgifts.com](https://xpgifts.com) (the reference site for this rebuild) runs on WooCommerce.

**This is a bigger lift than a drop-in swap for three of the eight data modules** (orders, addresses/auth, wishlist) - REST API v3 is designed for server-to-server admin access via a single store-wide consumer key/secret, not per-customer session auth. Those need an architecture decision before implementation starts (see **Open Decisions** below). Catalog data (products/categories) is a much more direct mapping and should go first.

## Architecture

- **New `src/lib/server/woocommerce.ts`** - a thin authenticated fetch wrapper: base URL + Basic Auth using a consumer key/secret, JSON parsing, and error handling for non-2xx responses.
- **Secrets, not vars**: `WC_CONSUMER_KEY` / `WC_CONSUMER_SECRET` must never reach the client bundle.
  - Local dev: add to `.dev.vars` (already gitignored - see `.gitignore`'s `.dev.vars*` / `!.dev.vars.example` entries; add a `.dev.vars.example` with placeholder keys).
  - Production: `wrangler secret put WC_CONSUMER_KEY` / `wrangler secret put WC_CONSUMER_SECRET`. `WC_STORE_URL` can be a plain `vars` entry in `wrangler.jsonc` since it's not sensitive.
  - Update `src/app.d.ts` `Platform.env` typing (or regenerate via `wrangler types`) once these bindings exist.
- **Required refactor: `+page.ts` → `+page.server.ts`.** Every route currently loading mock data via a universal `load` (`+page.ts`) runs that function in the browser too - which would leak the WC credentials if the fetch wrapper were called directly from it. Each of those load functions needs to move to `+page.server.ts` once it calls `woocommerce.ts`. This touches most routes in the app (home, shop, category, theme, product, search, orders, addresses, wishlist, help stays as-is).
- **Type adapters**: WC's product/order/customer JSON shapes don't match our mock types (`Product`, `Order`, `Address`, etc. in `src/lib/data/*.ts`) - e.g. WC `price` is a string, `images` is `{ src, alt, ... }[]`, `categories` is `{ id, name, slug }[]`, `average_rating` is a string, `stock_status` is `"instock" | "outofstock" | "onbackorder"`. Write a mapper per resource (e.g. `mapWcProduct(wc): Product`) so the rest of the app keeps using our existing types and components unchanged.

## Per-module plan

- [ ] **`categories.ts`** → `GET /wp-json/wc/v3/products/categories`, `GET /wp-json/wc/v3/products/categories/{id}` (or filter client-side by slug - WC doesn't support `?slug=` on this endpoint the same way `products` does, confirm during implementation). Clean 1:1 mapping.
- [ ] **`products.ts`** → `GET /wp-json/wc/v3/products` for `getProducts()`/`getFeaturedProducts()` (featured via `?featured=true`), `?category={id}` for `getProductsByCategory()`, `?search={q}` for `searchProducts()`, `GET /wp-json/wc/v3/products/{id}` (or `?slug={slug}`) for `getProductBySlug()`. `getRelatedProducts()` should use the `related_ids` field WC returns on a product detail response, then batch-fetch those (`?include=id1,id2,...`) rather than filtering by category client-side.
- [ ] **`themes.ts`** → **needs backend investigation first.** WooCommerce core has no built-in "theme"/occasion taxonomy - xpgifts.com's "Shop by Theme" nav is almost certainly a custom taxonomy or a set of product tags on the WP side. REST API v3 only exposes `categories` and `tags` out of the box; a custom taxonomy needs either `show_in_rest` enabled on that taxonomy (exposing it via the generic `wp/v2` REST API alongside `wc/v3`) or a custom endpoint. Confirm which it is before writing this module - the plan differs a lot depending on the answer.
- [ ] **`orders.ts`** → blocked on the auth decision below. Once resolved: `GET /wp-json/wc/v3/orders?customer={id}` for the list, `GET /wp-json/wc/v3/orders/{id}` for detail (with an ownership check - WC will happily return any order to a request authenticated with store-wide admin keys, so the app itself must verify `order.customer_id` matches the logged-in user before rendering).
- [ ] **`addresses.ts`** → also blocked on auth. WC doesn't have a standalone "addresses" resource - billing/shipping addresses live on the `customers/{id}` object, and a customer can really only have one of each (not a list). This is a data-model mismatch with the current `Address[]` "address book" UI (`/my-account/addresses`, `/my-account/addresses/new`, `/.../edit`) - decide whether to (a) collapse the address book UI down to WC's single-billing/single-shipping model, or (b) keep a multi-address book in our own storage (D1) and only sync the "default" one to WC at checkout time.
- [ ] **`wishlist.ts`** → not a WooCommerce REST API v3 concept at all. Either requires a wishlist plugin with its own REST endpoints (e.g. YITH WooCommerce Wishlist has an undocumented/limited REST surface - verify), or store wishlist state ourselves (D1 table keyed by customer ID). Recommend the latter unless a wishlist plugin is already installed on the target store.
- [ ] **`faq.ts`** → out of scope for WooCommerce entirely; this is just editorial content. Leave as static data, or move to WP pages/custom fields via the generic `wp/v2` REST API if the content should be editable without a redeploy. Not urgent.
- [x] **`user.ts` / auth** → done. `src/lib/data/user.ts` (mock `getCurrentUser()`) was deleted; `locals.user` (from `src/lib/server/auth.ts` + `hooks.server.ts`) is now the source of truth, exposed to `my-account/*` via `+layout.server.ts`.

## Open decisions (need answers before orders/addresses/wishlist/auth work starts)

1. ~~**Customer authentication strategy.**~~ **Resolved:** no JWT auth plugin is installed on the store (confirmed via `GET /wp-json/` root discovery - no `jwt-auth/v1` namespace). The store instead exposes its own custom login API under the same `xp/` namespace as `xp/topics` (see `WcTopic`): `POST /wc/v3/xp/authorize` (request body confirmed as `{u: <email>, p: <password>}`), plus `/wc/v3/xp/auth_account` and `/wc/v3/xp/auth_sessions` (GET/POST/DELETE, contract not yet explored). Implemented in `src/lib/server/auth.ts`:
   - `loginCustomer()` calls `xp/authorize` (Basic auth with the store consumer key/secret, same as `wcFetch`). Success response is confirmed as `{id, name}` (id numeric) - no bearer token is returned, so the app mints its own opaque session token and stores the resolved profile in KV (`XPGIFTS`) keyed by it, avoiding any need to guess the `auth_account`/`auth_sessions` contract for session lookups.
   - Session cookie is httpOnly/secure, 24h TTL, resolved each request via `hooks.server.ts`'s `authHandler` → `event.locals.user`.
   - `my-account/+layout.server.ts` now redirects to `/login` when `locals.user` is unset (the TODO guard is real).
   - `/logout` (`+server.ts`, POST) clears the cookie + KV record.
   - Not yet wired: `/register` and `/forgot-password` are still static mockups - only `/login` was in scope for this pass.
2. **Cart/checkout strategy.** Keep the current per-request Svelte-context cart (`src/lib/stores/cart-context.ts`) and only call WC's `POST /wp-json/wc/v3/orders` at the moment of checkout completion (cart itself stays client-side, never synced mid-session) - vs. adopting the WooCommerce Store API's server-side cart entirely. The former is less work and fits what's already built; recommend that unless there's a reason (e.g. real-time stock/price sync) to need the latter.
3. **Wishlist plugin?** Confirm whether the target WooCommerce store has one installed before deciding between "call its API" and "build our own."
4. **Themes taxonomy exposure** (see `themes.ts` above) - needs a look at the actual WP backend/REST API schema (`GET /wp-json/wc/v3` or `/wp-json` root discovery response lists available routes).
5. **Are REST API keys already generated?** (WooCommerce → Settings → Advanced → REST API on the WP admin.) Needed before any of this can be tested against a real store.

## Suggested build order

1. `src/lib/server/woocommerce.ts` client + secrets wiring + `.dev.vars.example`.
2. Type adapters for product/category (the two resources with no open decisions blocking them).
3. Swap `products.ts` and `categories.ts` accessors to live calls; convert their callers' `+page.ts` → `+page.server.ts`; verify `/`, `/shop`, `/product-category/[slug]`, `/product/[slug]`, `/search` against the real store.
4. Resolve **Open Decision 1** (auth) and **Decision 4** (themes taxonomy) - these gate most of what's left.
5. Auth: `/login` wired to `xp/authorize` (done - see Open Decision 1); `/register` and `/forgot-password` still need their own endpoints found/confirmed and wiring; `my-account/+layout.server.ts`'s TODO guard is real now.
6. Orders: live `orders.ts`, with the customer-ownership check called out above.
7. Addresses: implement whichever model was chosen in Decision 2/the addresses bullet above.
8. Wishlist: plugin integration or D1-backed implementation per Decision 3.
9. Cart/checkout: wire `POST /wp-json/wc/v3/orders` at order-placement time per Decision 2; remove the `cart.clear()` + static confirmation number in `checkout/+page.svelte` / `checkout/confirmation/+page.svelte` in favor of the real order ID.
10. Remove `src/lib/data/*.ts` mock modules once parity is confirmed (or keep them behind an env flag as an offline/dev fallback - useful for local development without live WC credentials).

## Verification

- Keep mock and live implementations swappable behind a single env flag during the transition (e.g. `USE_MOCK_DATA`) so routes can be tested independently as each module is migrated.
- `pnpm --filter xpgifts check` after each module migration (type adapters are exactly the kind of thing that silently drifts).
- `pnpm --filter xpgifts dev` and click through the routes touched by that module against a real (or WC staging) store.
- `pnpm run build` (root) before merging - confirms the Workers bundle still builds with the new server-side secrets/fetch calls.
