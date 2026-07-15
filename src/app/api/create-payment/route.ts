import { NextRequest, NextResponse } from "next/server";
import { CF_BASE, cfHeaders } from "@/lib/cashfree";

interface PaymentRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 500 },
      );
    }

    const body: PaymentRequest = await request.json();
    const { customerName, customerPhone, customerEmail } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Customer name and phone are required" },
        { status: 400 },
      );
    }

    // Generate unique IDs
    const linkId = `sample_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 7)}`;

    // Set expiry to 1 year from now
    const expiryTime = new Date();
    expiryTime.setFullYear(expiryTime.getFullYear() + 1);

    const origin = request.headers.get("origin") || "https://graycup.in";

    const paymentLinkPayload = {
      link_id: linkId,
      order_id: orderId,

      link_amount: 299,
      link_currency: "INR",
      link_purpose: "Sample Request - GrayCup",

      customer_details: {
        customer_name: customerName,
        customer_phone: customerPhone.replace(/\D/g, "").slice(-10),
        ...(customerEmail && { customer_email: customerEmail }),
      },

      link_meta: {
        return_url: `${origin}/sample-request?link_id=${linkId}`,
      },

      link_notify: {
        send_sms: true,
        send_email: true,
      },

      link_expiry_time: expiryTime.toISOString(),
    };

    const response = await fetch(`${CF_BASE}/links`, {
      method: "POST",
      headers: cfHeaders(),
      body: JSON.stringify(paymentLinkPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree API error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to create payment link" },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      paymentLink: data.link_url,
      linkId: data.link_id,
      orderId,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
