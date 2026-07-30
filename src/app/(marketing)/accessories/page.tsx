import { accessoryProducts } from "@/data/products";
import { ProductCard } from "@/components/products";

export default function AccessoriesPage() {
  return (
    <div className="min-h-dvh py-20 px-4 lg:px-6">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="text-start mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
            Accessories
          </h1>
          <p className="text-md md:text-lg text-muted-foreground">
            Accessories You can Buy from Us
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {accessoryProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        {accessoryProducts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No accessories available right now.
          </p>
        )}
      </div>
    </div>
  );
}
