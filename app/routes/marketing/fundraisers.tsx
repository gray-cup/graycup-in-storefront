import { getProductBySlug, FUNDRAISER_PRODUCT_SLUG } from "@/data/products";
import { getFundraiserStats } from "@/lib/fundraiser";
import { ProductConfigurator, GrindSizeProvider } from "@/components/products";
import { CURRENCY } from "@/lib/currency";
import type { Route } from "./+types/fundraisers";

export function meta() {
  return [
    { title: "Help us buy an Aillio Bullet R2 | Gray Cup Fundraiser" },
    {
      name: "description",
      content:
        "Gray Cup is raising funds for an Aillio Bullet R2 roaster. Every ₹350 you contribute gets you a 250g pack of coffee.",
    },
  ];
}

export function headers() {
  return {
    "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
  };
}

const ROASTER_IMAGES = [
  "/fundraiser/aillio-r2/BULLET-R2-Roaster.webp",
  "/fundraiser/aillio-r2/BULLET-R2-Roaster-2.webp",
];

export async function loader() {
  try {
    return await getFundraiserStats();
  } catch {
    return { packsSold: 0, raisedInr: 0, goalInr: 613000, packsNeeded: 1752, percent: 0 };
  }
}

export default function FundraisersPage({ loaderData }: Route.ComponentProps) {
  const product = getProductBySlug(FUNDRAISER_PRODUCT_SLUG);
  if (!product) return null;

  const stats = loaderData;
  const packsRemaining = Math.max(0, stats.packsNeeded - stats.packsSold);

  return (
    <div className="min-h-dvh py-20 px-4 lg:px-6">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="text-start mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
            Help Us Buy an Aillio Bullet R2
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl">
            We&apos;re raising {CURRENCY.symbol}
            {stats.goalInr.toLocaleString(CURRENCY.locale)} for an Aillio Bullet R2
            roaster, so we can roast in-house with tighter, more consistent quality
            control. Every {CURRENCY.symbol}
            {350} you contribute funds the roaster and gets you a 250g pack of our
            coffee - your choice of Medium or Dark roast.
          </p>
        </div>

        {/* Fundraiser Card */}
        <div className="mb-12 rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-1 bg-neutral-50">
              {ROASTER_IMAGES.map((src) => (
                <div key={src} className="relative aspect-square">
                  <img
                    src={src}
                    alt="Aillio Bullet R2 coffee roaster"
                    className="object-contain p-4 absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="p-6 flex flex-col justify-center">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                What we&apos;re raising for
              </p>
              <h2 className="text-2xl font-semibold text-black mb-2">
                Aillio Bullet R2
              </h2>
              <p className="text-3xl font-bold text-black mb-3">
                {CURRENCY.symbol}
                {stats.goalInr.toLocaleString(CURRENCY.locale)}
              </p>
              <p className="text-sm text-muted-foreground">
                An electric coffee roaster that will let us roast in-house with
                far tighter control over batch quality and consistency than our
                current setup.
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-16 rounded-lg border border-neutral-200 p-6">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-semibold">
              {CURRENCY.symbol}
              {stats.raisedInr.toLocaleString(CURRENCY.locale)}
            </span>
            <span className="text-sm text-muted-foreground">
              of {CURRENCY.symbol}
              {stats.goalInr.toLocaleString(CURRENCY.locale)} goal
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-black transition-all"
              style={{ width: `${stats.percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
            <span>{stats.percent.toFixed(1)}% funded</span>
            <span>
              {stats.packsSold.toLocaleString(CURRENCY.locale)} of{" "}
              {stats.packsNeeded.toLocaleString(CURRENCY.locale)} packs sold
            </span>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            We need <span className="font-medium text-black">{stats.packsNeeded.toLocaleString(CURRENCY.locale)}</span> 250g
            packs sold ({CURRENCY.symbol}350 each) to fully fund the roaster.{" "}
            <span className="font-medium text-black">
              {packsRemaining.toLocaleString(CURRENCY.locale)}
            </span>{" "}
            packs to go.
          </p>
        </div>

        {/* Buy a pack */}
        <div className="max-w-md">
          <h2 className="text-xl md:text-2xl font-semibold text-black mb-1">
            Contribute a Pack
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {CURRENCY.symbol}350 per 250g pack. Add more to contribute more.
          </p>
          <GrindSizeProvider>
            <ProductConfigurator product={product} />
          </GrindSizeProvider>
        </div>
      </div>
    </div>
  );
}
