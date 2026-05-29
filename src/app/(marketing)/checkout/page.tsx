"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, MapPin, Package } from "lucide-react";
import { toast } from "sonner";
import { authClient, type AuthUser } from "@/lib/auth-client";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/currency";

const FLAT_DELIVERY_CHARGE = 50;

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { items, total, clearCart } = useCart();

  const user = session?.user as AuthUser | undefined;

  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [gstNumber, setGstNumber] = useState("");

  const [payLoading, setPayLoading] = useState(false);

  // Redirect to login if not authenticated after session resolves
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/login?redirect=/checkout");
    }
  }, [session, isPending, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isPending && items.length === 0) {
      router.replace("/products");
    }
  }, [items, isPending, router]);

  function setField(field: keyof typeof address) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handlePay() {
    if (!address.addressLine1 || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill in all required address fields");
      return;
    }

    setPayLoading(true);
    try {
      // 1. Create order in our DB + Cashfree
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address: {
            ...address,
            name: user?.name ?? "",
            phone: user?.phone ?? "",
          },
          deliveryCharge: FLAT_DELIVERY_CHARGE,
          gstNumber: gstNumber.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to create order. Please try again.");
        return;
      }

      // 2. Launch Cashfree checkout (browser-only SDK)
      const { load } = await import("@cashfreepayments/cashfree-js");
      const cashfree = await load({
        mode:
          (process.env.NEXT_PUBLIC_CASHFREE_MODE as "sandbox" | "production") ??
          "production",
      });

      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });

      // clearCart() is called on the success page once payment is confirmed
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed to initialise. Please try again.");
    } finally {
      setPayLoading(false);
    }
  }

  // ── Loading / unauthenticated guard ───────────────────────────────────────
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }
  if (!session || items.length === 0) return null;

  const grandTotal = total + FLAT_DELIVERY_CHARGE;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
      </div>

      <h1 className="text-3xl font-bold font-poppins mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* ── Left: address ─────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-8">
          {/* Buyer info (read-only) */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-gray-500" />
              <h2 className="font-semibold text-lg">Your Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium">
                  {[user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
                    user?.name}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{user?.phone || "—"}</p>
              </div>
            </div>
          </section>

          {/* Address form */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-gray-500" />
              <h2 className="font-semibold text-lg">Delivery Address</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="addressLine1">
                  Address Line 1 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="addressLine1"
                  placeholder="House / Flat No., Street, Area"
                  value={address.addressLine1}
                  onChange={setField("addressLine1")}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addressLine2">
                  Address Line 2{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="addressLine2"
                  placeholder="Landmark, Colony, etc."
                  value={address.addressLine2}
                  onChange={setField("addressLine2")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    placeholder="Mumbai"
                    value={address.city}
                    onChange={setField("city")}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pincode">
                    Pincode <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pincode"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="400001"
                    value={address.pincode}
                    onChange={setField("pincode")}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="state">
                  State <span className="text-red-500">*</span>
                </Label>
                <select
                  id="state"
                  value={address.state}
                  onChange={setField("state")}
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* GST (optional) */}
          <section>
            <h2 className="font-semibold text-lg mb-3">GST Details</h2>
            <div className="space-y-1.5">
              <Label htmlFor="gstNumber">
                GSTIN{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Input
                id="gstNumber"
                placeholder="22AAAAA0000A1Z5"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                maxLength={15}
                className="font-mono uppercase"
              />
              <p className="text-xs text-gray-400">
                For GST invoice — leave blank if not applicable
              </p>
            </div>
          </section>

        </div>

        {/* ── Right: order summary ───────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="sticky top-4 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <Separator />

            {/* Cart items */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="relative h-14 w-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    {item.selectedVariant && (
                      <p className="text-xs text-gray-500">
                        {item.selectedVariant.name}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold whitespace-nowrap">
                    {formatPrice(
                      (item.selectedVariant?.price ?? item.product.priceRange.min) *
                        item.quantity,
                    )}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span>{formatPrice(FLAT_DELIVERY_CHARGE)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handlePay}
              disabled={payLoading}
            >
              {payLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Redirecting to payment…
                </>
              ) : (
                `Pay ${formatPrice(grandTotal)}`
              )}
            </Button>

            <p className="text-xs text-center text-gray-400">
              Secured by Cashfree
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
