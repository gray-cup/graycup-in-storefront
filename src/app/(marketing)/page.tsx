import {
  dooarsAssamTeaProducts,
  giddapaharDarjeelingProducts,
  samplePackProducts,
  products,
} from "@/data/products";
import { HeroSection, AnimatedProductRow, SamplePacksSection, BrandNarrative } from "@/components/home";

export const revalidate = 3600;

const specialtyCoffeeProducts = products.filter(
  (p) => p.category === "Coffee" && p.quality === "Speciality",
);
const basicCoffeeProducts = products.filter(
  (p) => p.category === "Coffee" && p.quality === "Commercial",
);

export default function Home() {
  return (
    <div>
      <div className="mx-auto px-4 lg:px-6 h-auto my-10">
        <div className="md:min-h-dvh pt-10 pb-20 max-w-6xl mx-auto md:pb-0 flex flex-col justify-center">
          <div>
            {/* Hero Section */}
            <div>
              {/* <HeroSection /> */}

              {/* Featured Products Section */}
              <div id="products" className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 lg:px-6">
                  <AnimatedProductRow
                    title="Tea"
                    products={[...dooarsAssamTeaProducts, ...giddapaharDarjeelingProducts]}
                    delay={0}
                  />
                  <SamplePacksSection products={samplePackProducts} delay={0.05} />
                  <AnimatedProductRow title="Basic Coffee" products={basicCoffeeProducts} delay={0.1} />
                  <AnimatedProductRow title="Specialty Coffee" products={specialtyCoffeeProducts} delay={0.15} />
                </div>
              </div>
            </div>
          </div>

          <div className="my-10 py-10 bg-neutral-100">
            <h2 className="text-5xl font-medium text-neutral-900 mb-6 flex justify-center flex-row items-center gap-4 font-instrument-sans"></h2>
          </div>

          <BrandNarrative />

          {/* <Image src="/beans-circle.webp" alt="coffee beans" className="pl-2" width={200} height={200} /> */}
        </div>
      </div>
    </div>
  );
}
