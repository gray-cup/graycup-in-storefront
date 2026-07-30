/**
 * Renders a static OG image per product, built from each product's image gallery.
 * Runs at build time (see "prebuild" script) and via the pre-commit hook, so the
 * PNGs are committed to git rather than computed on every request.
 */
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { products } from "../src/data/products";
import type { Product } from "../src/data/products/types";

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUTPUT_DIR = path.join(PUBLIC_DIR, "og", "products");
const FONTS_DIR = path.join(__dirname, "og", "fonts");

const WIDTH = 1200;
const HEIGHT = 630;

function loadFont(file: string) {
  return readFileSync(path.join(FONTS_DIR, file));
}

const fonts = [
  { name: "Poppins", weight: 400 as const, style: "normal" as const, data: loadFont("Poppins-Regular.ttf") },
  { name: "Poppins", weight: 500 as const, style: "normal" as const, data: loadFont("Poppins-Medium.ttf") },
  { name: "Poppins", weight: 600 as const, style: "normal" as const, data: loadFont("Poppins-SemiBold.ttf") },
  { name: "Poppins", weight: 700 as const, style: "normal" as const, data: loadFont("Poppins-Bold.ttf") },
];

type LoadedImage = { uri: string; width: number; height: number };

async function loadImage(imagePath: string): Promise<LoadedImage | null> {
  const relative = imagePath.replace(/^\//, "");
  const absolute = path.join(PUBLIC_DIR, relative);

  if (!existsSync(absolute)) {
    console.warn(`  ! missing image on disk, skipping: ${imagePath}`);
    return null;
  }

  // resvg's SVG <image> renderer only decodes PNG/JPEG, so normalize everything
  // (webp in particular) to PNG before embedding.
  const image = sharp(absolute);
  const { width, height } = await image.metadata();
  const png = await image.png().toBuffer();

  if (!width || !height) {
    return null;
  }

  return { uri: `data:image/png;base64,${png.toString("base64")}`, width, height };
}

function heroImageFor(product: Product): string {
  return product.images && product.images.length > 0 ? product.images[0] : product.image;
}

const IMAGE_MAX_WIDTH = 480;
const IMAGE_MAX_HEIGHT = 474; // canvas height minus header + top padding, so the image lands flush with the bottom edge

async function buildLayout(product: Product) {
  const image = await loadImage(heroImageFor(product));

  let displayWidth = 0;
  let displayHeight = 0;
  if (image) {
    const scale = Math.min(IMAGE_MAX_WIDTH / image.width, IMAGE_MAX_HEIGHT / image.height);
    displayWidth = Math.round(image.width * scale);
    displayHeight = Math.round(image.height * scale);
  }

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
        paddingTop: "56px",
        paddingLeft: "56px",
        paddingRight: "56px",
        paddingBottom: 0,
        fontFamily: "Poppins",
      },
      children: [
        // Header
        {
          type: "div",
          props: {
            style: { display: "flex", marginBottom: "32px" },
            children: [
              {
                type: "span",
                props: { style: { fontSize: 36, fontWeight: 600, color: "#1a1a1a" }, children: "Gray Cup" },
              },
            ],
          },
        },
        // Main content
        {
          type: "div",
          props: {
            style: { display: "flex", flex: 1, gap: "48px", alignItems: "flex-end" },
            children: [
              // Hero image
              {
                type: "div",
                props: {
                  style: { display: "flex" },
                  children: image
                    ? {
                        type: "img",
                        props: {
                          src: image.uri,
                          style: { width: `${displayWidth}px`, height: `${displayHeight}px` },
                        },
                      }
                    : [],
                },
              },
              // Product info
              {
                type: "div",
                props: {
                  style: {
                    flex: 1,
                    alignSelf: "stretch",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  },
                  children: [
                    {
                      type: "h1",
                      props: {
                        style: {
                          fontSize: 56,
                          fontWeight: 700,
                          color: "#1a1a1a",
                          margin: 0,
                          lineHeight: 1.15,
                        },
                        children: product.name,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function generateOne(product: Product) {
  const layout = await buildLayout(product);
  const svg = await satori(layout as unknown as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } });
  const png = resvg.render().asPng();

  writeFileSync(path.join(OUTPUT_DIR, `${product.slug}.png`), png);
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`Generating ${products.length} OG images...`);
  for (const product of products) {
    await generateOne(product);
    console.log(`  ✓ ${product.slug}.png`);
  }
  console.log(`Done. Written to ${path.relative(ROOT, OUTPUT_DIR)}/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
