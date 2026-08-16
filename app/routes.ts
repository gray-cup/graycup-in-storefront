import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  route("wholesale", "routes/redirects/wholesale.tsx"),
  route("wholesale/:state", "routes/redirects/wholesale.$state.tsx"),
  route("wholesale/:state/:city", "routes/redirects/wholesale.$state.$city.tsx"),

  route("products.json", "routes/products.json.ts"),
  ...prefix("feeds", [
    route("products.xml", "routes/feeds/products.xml.ts"),
    route("google-merchant-products.xml", "routes/feeds/google-merchant-products.xml.ts"),
  ]),

  ...prefix("api", [
    route("auth/*", "routes/api/auth.ts"),
    route("checkout", "routes/api/checkout.ts"),
    route("create-payment", "routes/api/create-payment.ts"),
    route("payment/verify", "routes/api/payment.verify.ts"),
    route("payment/refund", "routes/api/payment.refund.ts"),
    route("payment/webhook", "routes/api/payment.webhook.ts"),
    route("subscription/webhook", "routes/api/subscription.webhook.ts"),
    route("subscription/create", "routes/api/subscription.create.ts"),
    route("subscription/create-upfront", "routes/api/subscription.create-upfront.ts"),
    route("subscription/list", "routes/api/subscription.list.ts"),
    route("subscription/manage", "routes/api/subscription.manage.ts"),
    route("subscription/status/:subscriptionId", "routes/api/subscription.status.$subscriptionId.ts"),
    route("validate-coupon", "routes/api/validate-coupon.ts"),
    route("contact", "routes/api/contact.ts"),
    route("reviews", "routes/api/reviews.ts"),
    route("webhooks/feature", "routes/api/webhooks.feature.ts"),
  ]),

  layout("routes/marketing/layout.tsx", [
    index("routes/marketing/home.tsx"),
    route("about", "routes/marketing/about.tsx"),
    route("careers", "routes/marketing/careers.tsx"),
    route("cart", "routes/marketing/cart.tsx"),
    route("checkout", "routes/marketing/checkout.tsx"),
    route("contact", "routes/marketing/contact.tsx"),
    route("distributor-franchise", "routes/marketing/distributor-franchise.tsx"),
    route("fundraisers", "routes/marketing/fundraisers.tsx"),
    route("how-to-use", "routes/marketing/how-to-use.tsx"),
    route("locations", "routes/marketing/locations.tsx"),
    route("payment/failure", "routes/marketing/payment-failure.tsx"),
    route("payment/success", "routes/marketing/payment-success.tsx"),
    route("privacy", "routes/marketing/privacy.tsx"),
    route("return-policy", "routes/marketing/return-policy.tsx"),
    route("social-responsibility", "routes/marketing/social-responsibility.tsx"),
    route("sites", "routes/marketing/sites.tsx"),
    route("team", "routes/marketing/team.tsx"),
    route("terms", "routes/marketing/terms.tsx"),
    route("accessories", "routes/marketing/accessories.tsx"),
    route("green-wholesale-coffee", "routes/marketing/green-wholesale-coffee.tsx"),

    route("roasted-wholesale-coffee", "routes/marketing/roasted-wholesale-coffee.tsx"),
    route("roasted-wholesale-coffee/:state", "routes/marketing/roasted-wholesale-coffee.$state.tsx"),
    route("roasted-wholesale-coffee/:state/:city", "routes/marketing/roasted-wholesale-coffee.$state.$city.tsx"),

    route("products", "routes/marketing/products-index.tsx"),
    route("products/:slug", "routes/marketing/products.$slug.tsx"),

    route("glossary", "routes/marketing/glossary-index.tsx"),
    route("glossary/:slug", "routes/marketing/glossary.$slug.tsx"),

    route("guides", "routes/marketing/guides-index.tsx"),
    route("guides/best-black-coffee-for-fatty-liver", "routes/marketing/guides/best-black-coffee-for-fatty-liver.mdx"),
    route("guides/black-coffee-liver-health", "routes/marketing/guides/black-coffee-liver-health.mdx"),
    route("guides/brewing-the-perfect-cup", "routes/marketing/guides/brewing-the-perfect-cup.mdx"),
    route("guides/ctc-vs-loose-leaf-tea", "routes/marketing/guides/ctc-vs-loose-leaf-tea.mdx"),
    route("guides/instant-vs-brewed-coffee", "routes/marketing/guides/instant-vs-brewed-coffee.mdx"),

    route("subscribe/:productSlug", "routes/marketing/subscribe.$productSlug.tsx"),

    route("auth/login", "routes/marketing/auth/login.tsx"),
    route("auth/register", "routes/marketing/auth/register.tsx"),
    route("auth/forgot-password", "routes/marketing/auth/forgot-password.tsx"),
    route("auth/reset-password", "routes/marketing/auth/reset-password.tsx"),

    layout("routes/marketing/account/layout.tsx", [
      route("account/subscriptions", "routes/marketing/account/subscriptions.tsx"),
    ]),

    // Location pages ([state]/[slug] and [state]/[slug]/[topic] from the Next
    // app) must come last - they're single/double dynamic segments that would
    // otherwise shadow every static path above.
    route(":state/:slug", "routes/marketing/$state.$slug.tsx"),
    route(":state/:slug/:topic", "routes/marketing/$state.$slug.$topic.tsx"),

    // Catch-all route for handling 404s gracefully without internal router errors
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;

