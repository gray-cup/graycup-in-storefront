import {
  dooarsAssamTeaProducts,
  giddapaharDarjeelingProducts,
  samplePackProducts,
  retailProducts,
} from "@/data/products";
import {
  HeroSection,
  HomeProductTabs,
  BrandNarrative,
  CoffeeQuizCard,
} from "@/components/home";

const teaProducts = [...dooarsAssamTeaProducts, ...giddapaharDarjeelingProducts];
const retailCoffeeProducts = retailProducts.filter((p) => p.category === "Coffee");
const coffeeBlendProducts = retailCoffeeProducts.filter((p) => p.categoryTwo === "Blend");
const specialtyCoffeeProducts = retailCoffeeProducts.filter(
  (p) => p.quality === "Speciality",
);
const groundCoffeeProducts = retailCoffeeProducts.filter(
  (p) => p.quality === "Commercial" && p.categoryTwo !== "Blend",
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
                  <HomeProductTabs
                    teaProducts={teaProducts}
                    samplePackProducts={samplePackProducts}
                    groundCoffeeProducts={groundCoffeeProducts}
                    coffeeBlendProducts={coffeeBlendProducts}
                    specialtyCoffeeProducts={specialtyCoffeeProducts}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="my-10 py-10 bg-neutral-100">
            <div className="max-w-3xl mx-auto px-4 lg:px-6">
              <CoffeeQuizCard />
            </div>
          </div>

          <BrandNarrative />

          {/* <Image src="/beans-circle.webp" alt="coffee beans" className="pl-2" width={200} height={200} /> */}
        </div>
      </div>
    </div>
  );
}
