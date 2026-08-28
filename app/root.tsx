import { useEffect, useState } from "react";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  type ErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import RootProviders from "@/components/providers";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo";
import { ChunkErrorReload } from "@/components/chunk-error-reload";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Terminal, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

export function meta() {
  return [
    { title: "Gray Cup | Premium Indian Tea, Coffee & Matcha" },
    {
      name: "description",
      content:
        "Gray Cup sources premium Indian tea, specialty coffee, and matcha. Shop online at graycup.in or buy wholesale for cafes and businesses.",
    },
    { property: "og:title", content: "Gray Cup | Premium Indian Tea, Coffee & Matcha" },
    {
      property: "og:description",
      content:
        "Gray Cup sources premium Indian tea, specialty coffee, and matcha. Shop online at graycup.in or buy wholesale for cafes and businesses.",
    },
    { property: "og:image", content: "https://graycup.in/og.png" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Gray Cup | Premium Indian Tea, Coffee & Matcha" },
    {
      name: "twitter:description",
      content:
        "Gray Cup sources premium Indian tea, specialty coffee, and matcha. Shop online at graycup.in or buy wholesale for cafes and businesses.",
    },
    { name: "twitter:image", content: "https://graycup.in/og.png" },
    { name: "facebook-domain-verification", content: "logm65vjqg9own5svlo4llym2l4cg3" },
  ];
}

export function links() {
  return [
    { rel: "icon", href: "/favicon.ico" },
    {
      rel: "icon",
      href: "/icon-light.svg",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      href: "/icon-dark.svg",
      media: "(prefers-color-scheme: dark)",
    },
    {
      rel: "apple-touch-icon",
      href: "/icon-light.svg",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "apple-touch-icon",
      href: "/icon-dark.svg",
      media: "(prefers-color-scheme: dark)",
    },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Instrument+Sans:wght@400;500;600;700&family=Public+Sans:wght@400;500;600;700&display=swap",
    },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-width=cover" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light" />
        <meta name="p:domain_verify" content="263c83126f8d79bccabc00711d8d80c6" />
        <Meta />
        <Links />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--font-sans:'Inter',sans-serif;--font-poppins:'Poppins',sans-serif;--font-mono:'Inter',monospace;--font-instrument-sans:'Instrument Sans',sans-serif;--font-public-sans:'Public Sans',sans-serif;}`,
          }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Z7GMJ50BR2"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-Z7GMJ50BR2');`,
          }}
        />
      </head>
      <body className={cn("min-h-dvh bg-background font-sans antialiased")}>
        <OrganizationSchema />
        <WebSiteSchema />
        <ChunkErrorReload />
        <RootProviders>{children}</RootProviders>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }
  return <ServerError error={error} />;
}

function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Navbar />
      <div className="w-full py-20 max-w-7xl mx-auto px-4 lg:px-6 h-auto overflow-y-auto md:overflow-hidden flex flex-col items-center justify-center">
        <div className="text-center my-16">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 mb-6">
            <span className="text-4xl font-bold text-neutral-400">404</span>
          </div>
          <h1 className="text-4xl font-semibold text-neutral-800 mb-4">
            You seem lost bro
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
            This page doesn't exist but you should play with our features.
          </p>
          <div className="flex justify-center items-center gap-4">
            <Button variant="lightgray" size="lg" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            <Button variant="blue" size="lg" asChild>
              <Link to="/">Play with Us</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ServerError({ error }: { error: unknown }) {
  const [showErrors, setShowErrors] = useState(false);
  const err = error as (Error & { digest?: string }) | ErrorResponse | undefined;
  const message =
    err && "message" in (err as Error) ? (err as Error).message : undefined;
  const stack = err && "stack" in (err as Error) ? (err as Error).stack : undefined;
  const digest =
    err && "digest" in (err as Error & { digest?: string })
      ? (err as Error & { digest?: string }).digest
      : undefined;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-dvh w-full items-center justify-center bg-background">
      <Card className="w-full max-w-md border-dashed border-2 rounded-none shadow-none">
        <CardHeader className="border-b border-dashed pb-4">
          <div className="flex items-center space-x-2">
            <Terminal className="h-5 w-5" />
            <span className="text-sm font-mono">system_failure.sh</span>
          </div>
        </CardHeader>
        <CardContent className="pt-6 pb-0 font-mono">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">$</span>
              <span>status</span>
            </div>
            <div className="space-y-1 pl-6">
              <p className="text-3xl font-bold">500</p>
              <p className="text-muted-foreground">Server error encountered</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">$</span>
              <div className="flex items-center">
                <span>repair_system</span>
                <span className="ml-1 h-5 w-2 animate-pulse bg-foreground inline-block" />
              </div>
            </div>
          </div>

          {showErrors && (
            <div className="mt-4 space-y-2 border-t border-dashed pt-4 text-xs text-muted-foreground">
              {digest && (
                <p>
                  <span className="text-foreground">digest:</span> {digest}
                </p>
              )}
              <p className="whitespace-pre-wrap break-words">
                <span className="text-foreground">message:</span>{" "}
                {message || "No message available"}
              </p>
              {stack && (
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded border border-dashed p-2">
                  {stack}
                </pre>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-6 border-t border-dashed mt-6 flex flex-col sm:flex-row flex-wrap gap-2">
          <Button
            variant="outline"
            className="w-full rounded-none border-dashed font-mono"
            onClick={() => setShowErrors((prev) => !prev)}
          >
            {showErrors ? (
              <ChevronUp className="mr-2 h-4 w-4" />
            ) : (
              <ChevronDown className="mr-2 h-4 w-4" />
            )}
            $ show_errors
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-none border-dashed"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />$ system_restart
          </Button>
          <Button variant="outline" className="w-full rounded-none border-dashed" asChild>
            <Link to="/">$ cd /home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}