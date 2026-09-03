import { Outlet } from "react-router";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/cart";

// Bare POST / (no ?index) targets this pathless layout, not the index route.
// Absorb it so React Router doesn't throw an internal 405 into Workers logs.
export async function action() {
  return new Response("Method Not Allowed", { status: 405 });
}

export default function MarketingLayout() {
  return (
    <div className=" flex flex-col">
      {/* Sticky Header Group */}
      {/* bg-white here (not just on the header) so iOS Safari 26 samples a
          solid color off this sticky element to tint the status bar */}
      <div className="sticky top-0 z-50 bg-white">
        <p className="bg-black px-4 py-1.5 text-center text-xs font-medium tracking-wide text-white">
          Free delivery on orders above ₹{FREE_DELIVERY_THRESHOLD}
        </p>
        <Navbar />
      </div>

      {/* Main content */}
      <main className="w-full">
        <div className="max-w-7xl mx-auto  ">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
