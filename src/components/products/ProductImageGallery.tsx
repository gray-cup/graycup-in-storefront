"use client";

import { useState } from "react";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
  priority?: boolean;
};

export function ProductImageGallery({ images, productName, priority }: ProductImageGalleryProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="lg:sticky lg:top-24">
      <div className="aspect-[5/4] relative rounded-2xl overflow-hidden">
        <img
          src={images[current]}
          alt={productName}
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setCurrent(i)}
              className={`relative h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                i === current ? "border-black" : "border-gray-200 hover:border-gray-400"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={src}
                alt={`${productName} thumbnail ${i + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
