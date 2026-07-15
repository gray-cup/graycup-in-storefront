import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/data/products";

export const alt = "Gray Cup - Product";
export const size = {
  width: 2400,
  height: 1260,
};
export const contentType = "image/png";

function formatCurrency(value: number): string {
  return value.toLocaleString("en-IN");
}

export default async function Image({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 96,
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          Product Not Found
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "96px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "64px",
          }}
        >
          <span
            style={{
              fontSize: "56px",
              fontWeight: "600",
              color: "#1a1a1a",
            }}
          >
            Gray Cup
          </span>
        </div>

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "96px",
          }}
        >
          {/* Product image */}
          <div
            style={{
              width: "800px",
              height: "800px",
              background: "white",
              borderRadius: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #e5e5e5",
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                product.image.startsWith("http")
                  ? product.image
                  : `https://graycup.in${product.image}`
              }
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Product info */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                fontSize: "104px",
                fontWeight: "700",
                color: "#1a1a1a",
                margin: "0 0 32px 0",
                lineHeight: 1.1,
              }}
            >
              {product.name}
            </h1>
            <p
              style={{
                fontSize: "48px",
                color: "#525252",
                margin: "0 0 64px 0",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.description}
            </p>

            {/* Price and MOQ */}
            <div
              style={{
                display: "flex",
                gap: "64px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: "32px",
                    color: "#737373",
                    marginBottom: "8px",
                  }}
                >
                  Price Range
                </span>
                <span
                  style={{
                    fontSize: "56px",
                    fontWeight: "600",
                    color: "#1a1a1a",
                  }}
                >
                  {formatCurrency(product.priceRange.min)} -{" "}
                  {formatCurrency(product.priceRange.max)}/kg
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: "32px",
                    color: "#737373",
                    marginBottom: "8px",
                  }}
                >
                  Minimum Order
                </span>
                <span
                  style={{
                    fontSize: "56px",
                    fontWeight: "600",
                    color: "#1a1a1a",
                  }}
                >
                  {product.minimumOrder.quantity} {product.minimumOrder.unit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "48px",
            paddingTop: "48px",
            borderTop: "2px solid #e5e5e5",
          }}
        >
          <span
            style={{
              fontSize: "36px",
              color: "#737373",
            }}
          >
            graycup.in
          </span>
          <span
            style={{
              fontSize: "36px",
              color: "#737373",
            }}
          >
            Premium Tea & Coffee Suppliers
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
