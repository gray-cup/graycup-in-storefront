"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Turnstile, useTurnstile } from "@/components/ui/turnstile";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";
  const turnstile = useTurnstile();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    if (!turnstile.isVerified) {
      toast.error("Please complete the verification check");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email: form.email,
        password: form.password,
        name: [form.firstName, form.lastName].filter(Boolean).join(" "),
        // @ts-expect-error – additional fields passed through better-auth
        firstName: form.firstName,
        lastName: form.lastName || undefined,
        phone: phoneDigits.slice(-10),
        fetchOptions: { headers: { "x-captcha-response": turnstile.token! } },
      });

      if (error) {
        toast.error(error.message ?? "Registration failed");
        turnstile.reset();
        return;
      }

      // requireEmailVerification is on, so no session exists yet — the buyer
      // must click the verify link we just emailed them before they can sign in.
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold font-poppins mb-2">Check your email</h1>
          <p className="text-sm text-gray-500">
            We sent a verification link to <span className="font-medium">{form.email}</span>.
            Click it to activate your account, then sign in.
          </p>
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(redirectTo)}`}
            className="inline-block mt-6 text-black font-medium underline underline-offset-4 text-sm"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold font-poppins mb-1">Create account</h1>
        <p className="text-sm text-gray-500 mb-8">
          Sign up to place orders on GrayCup
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Arjun"
                value={form.firstName}
                onChange={set("firstName")}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">
                Last Name{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Sharma"
                value={form.lastName}
                onChange={set("lastName")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="9876543210"
              value={form.phone}
              onChange={set("phone")}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={set("password")}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              required
            />
          </div>

          <Turnstile
            onVerify={turnstile.handleVerify}
            onError={turnstile.handleError}
            onExpire={turnstile.handleExpire}
          />

          <Button type="submit" className="w-full" disabled={loading || !turnstile.isVerified}>
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(redirectTo)}`}
            className="text-black font-medium underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
