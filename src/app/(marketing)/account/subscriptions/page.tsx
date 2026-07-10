"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pause, Play, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CURRENCY } from "@/lib/currency";

type SubscriptionRow = {
  id: string;
  subscriptionId: string;
  status: "pending" | "active" | "paused" | "ended";
  planDetails: {
    plan_name: string;
    plan_amount: number;
    plan_interval_type: string;
    plan_intervals: number;
    plan_currency: string;
  };
  createdAt: string;
};

const STATUS_LABEL: Record<SubscriptionRow["status"], string> = {
  pending: "Awaiting authorization",
  active: "Active",
  paused: "Paused",
  ended: "Ended",
};

const STATUS_VARIANT: Record<SubscriptionRow["status"], "default" | "secondary" | "outline"> = {
  pending: "outline",
  active: "default",
  paused: "secondary",
  ended: "secondary",
};

export default function AccountSubscriptionsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState<string | null>(null);

  const loadSubscriptions = useCallback(async () => {
    const res = await fetch("/api/subscription/list");
    if (res.ok) {
      const data = await res.json();
      setSubscriptions(data.subscriptions);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.user) {
      router.replace("/auth/login?redirect=/account/subscriptions");
      return;
    }
    loadSubscriptions();
  }, [session, sessionLoading, router, loadSubscriptions]);

  const handleAction = async (subscriptionId: string, action: "CANCEL" | "PAUSE" | "ACTIVATE") => {
    setActingOn(subscriptionId);
    try {
      const res = await fetch("/api/subscription/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, action }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not update subscription");
        return;
      }

      toast.success("Subscription updated");
      await loadSubscriptions();
    } finally {
      setActingOn(null);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold font-poppins mb-8">My Subscriptions</h1>

      {subscriptions.length === 0 ? (
        <p className="text-muted-foreground">
          You don&apos;t have any subscriptions yet. Subscribe to a product to get it
          delivered on a recurring schedule.
        </p>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <Card key={sub.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{sub.planDetails.plan_name}</CardTitle>
                    <CardDescription>
                      {CURRENCY.symbol}
                      {sub.planDetails.plan_amount.toLocaleString(CURRENCY.locale)} every{" "}
                      {sub.planDetails.plan_intervals}{" "}
                      {sub.planDetails.plan_interval_type.toLowerCase()}
                      {sub.planDetails.plan_intervals > 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                  <Badge variant={STATUS_VARIANT[sub.status]}>{STATUS_LABEL[sub.status]}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Subscription ID: {sub.subscriptionId}
              </CardContent>
              {sub.status !== "ended" && (
                <CardFooter className="gap-2">
                  {sub.status === "paused" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actingOn === sub.subscriptionId}
                      onClick={() => handleAction(sub.subscriptionId, "ACTIVATE")}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Resume
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actingOn === sub.subscriptionId || sub.status === "pending"}
                      onClick={() => handleAction(sub.subscriptionId, "PAUSE")}
                    >
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="red"
                    disabled={actingOn === sub.subscriptionId}
                    onClick={() => handleAction(sub.subscriptionId, "CANCEL")}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
