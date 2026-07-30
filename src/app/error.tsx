"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Terminal, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
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
              <span>error_trace</span>
            </div>
            <div className="pl-6 text-sm text-muted-foreground">
              <p className="truncate">
                {error?.digest || "Unknown error occurred"}
              </p>
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
              {error?.digest && (
                <p>
                  <span className="text-foreground">digest:</span> {error.digest}
                </p>
              )}
              <p className="whitespace-pre-wrap break-words">
                <span className="text-foreground">message:</span>{" "}
                {error?.message || "No message available"}
              </p>
              {error?.stack && (
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded border border-dashed p-2">
                  {error.stack}
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
            onClick={reset}
          >
            <RefreshCw className="mr-2 h-4 w-4" />$ system_restart
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-none border-dashed"
            asChild
          >
            <Link href="/">$ cd /home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
