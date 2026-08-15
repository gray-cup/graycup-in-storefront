import { Outlet } from "react-router";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

export default function MarketingLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Sticky Header Group */}
      <div className="sticky top-0 z-50">
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
