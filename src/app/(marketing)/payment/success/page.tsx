"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Package } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency";

type AddressSnapshot = {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

type VerifyResult =
  | {
      status: "paid";
      orderId: string;
      amount: number;
      customerName: string | null;
      customerEmail: string | null;
      addressSnapshot: AddressSnapshot | null;
      itemCount: number | null;
    }
  | { status: "pending" | "failed"; orderId: string | null; amount: number | null }
  | null;

function SuccessContent() {
  const searchParams = useSearchParams();
  const cashfreeOrderId = searchParams.get("order_id");
  const { clearCart } = useCart();

  const [result, setResult] = useState<VerifyResult>(null);
  const [loading, setLoading] = useState(true);
  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    if (!cashfreeOrderId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `/api/payment/verify?order_id=${encodeURIComponent(cashfreeOrderId)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        setResult(data);

        if (data.status === "paid" && !cartCleared) {
          clearCart();
          setCartCleared(true);
        }
      } catch {
        setResult({ status: "failed", orderId: null, amount: null });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cashfreeOrderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Confirming your payment…</p>
      </div>
    );
  }

  // ── Paid ─────────────────────────────────────────────────────────────────
  if (result?.status === "paid") {
    const addr = result.addressSnapshot;
    const addrLine = [addr?.addressLine1, addr?.addressLine2].filter(Boolean).join(", ");
    const addrCity = [addr?.city, addr?.state, addr?.pincode].filter(Boolean).join(", ");

    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-14 w-14 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold font-poppins mb-1">Order Confirmed!</h1>
          <p className="text-gray-500 text-sm">
            Thank you{result.customerName ? `, ${result.customerName}` : ""}. We&apos;ve received your payment.
          </p>
        </div>

        {/* Order details card */}
        <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 mb-6 text-sm">
          {result.amount && (
            <div className="flex justify-between items-center px-5 py-3">
              <span className="text-gray-500">Amount paid</span>
              <span className="font-semibold">{formatPrice(result.amount)}</span>
            </div>
          )}
          {result.itemCount && (
            <div className="flex justify-between items-center px-5 py-3">
              <span className="text-gray-500">Items</span>
              <span className="font-medium">{result.itemCount} item{result.itemCount !== 1 ? "s" : ""}</span>
            </div>
          )}
          {result.orderId && (
            <div className="flex justify-between items-center px-5 py-3">
              <span className="text-gray-500">Order ref</span>
              <span className="font-mono text-xs text-gray-400 truncate max-w-[180px]">{result.orderId}</span>
            </div>
          )}
          {(addrLine || addrCity) && (
            <div className="flex justify-between items-start px-5 py-3 gap-4">
              <span className="text-gray-500 shrink-0">Delivering to</span>
              <span className="text-right text-gray-700">
                {addrLine && <span className="block">{addrLine}</span>}
                {addrCity && <span className="block">{addrCity}</span>}
              </span>
            </div>
          )}
        </div>

        {/* Next steps */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-sm">
          <div className="flex gap-2 items-start">
            <Package className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-amber-800">What&apos;s next?</p>
              <p className="text-amber-700 mt-1">
                Our team will pack and dispatch your order within 1–2 business
                days. You&apos;ll receive a tracking ID once dispatched.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Pending (still processing) ────────────────────────────────────────────
  if (result?.status === "pending") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="flex justify-center mb-6">
          <Loader2 className="h-16 w-16 text-yellow-500 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold font-poppins mb-2">Payment Processing</h1>
        <p className="text-gray-600 mb-8">
          Your payment is being verified. This usually takes a few seconds.
          Please do not close this page.
        </p>
        <Button onClick={() => window.location.reload()}>Refresh Status</Button>
      </div>
    );
  }

  // ── Failed / unknown ──────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="flex justify-center mb-6">
        <XCircle className="h-16 w-16 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold font-poppins mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-8">
        Your payment could not be processed. No money has been charged.
        Please try again or contact support.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link href="/cart">Return to Cart</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
