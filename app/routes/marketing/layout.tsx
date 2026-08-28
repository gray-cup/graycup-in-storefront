import { Outlet } from "react-router";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

export default function MarketingLayout() {
  return (
    <div className=" flex flex-col">
      {/* Sticky Header Group */}
      {/* bg-white here (not just on the header) so iOS Safari 26 samples a
          solid color off this sticky element to tint the status bar */}
      <div className="sticky top-0 z-50 bg-white">
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
