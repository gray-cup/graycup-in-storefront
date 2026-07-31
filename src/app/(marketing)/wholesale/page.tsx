import { wholesaleCoffeeProducts } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";

export default function WholesalePage() {
  return (
    <div className="min-h-dvh py-20 px-4 lg:px-6">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="text-start mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
            Wholesale Indian Roasted Coffee Beans and Ground Coffee
          </h1>
          <p className="text-md md:text-lg text-muted-foreground">
            Buy Indian Roasted Coffee Whole Beans and Ground Coffee in Bulk Quantities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wholesaleCoffeeProducts.map((product) => (
            <div key={product.slug}>
              <ProductCard product={product} showPrice={false} />
              <p className="text-sm text-muted-foreground mt-2 px-1">
                {product.priceRange.min === product.priceRange.max
                  ? `₹${product.priceRange.min.toLocaleString("en-IN")} / kg`
                  : `₹${product.priceRange.min.toLocaleString("en-IN")}–₹${product.priceRange.max.toLocaleString("en-IN")} / kg`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
