import { Link } from "react-router";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentFailurePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="flex justify-center mb-6">
        <XCircle className="h-16 w-16 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold font-poppins mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-8">
        Something went wrong during your payment. No money has been charged.
        Your cart is still saved - please try again.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild>
          <Link to="/cart">Return to Cart</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
