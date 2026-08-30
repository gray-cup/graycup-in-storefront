import { rateLimit } from "@/lib/rate-limit";
import type { Route } from "./+types/contact";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  companySize: string;
  message: string;
}

function getClientIP(request: Request): string {
  // Try to get real IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(",")[0].trim();

  // Fallback for unknown IP
  return "unknown";
}

function validateContactData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim().length === 0
  ) {
    errors.push("Name is required");
  } else if (data.name.trim().length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Invalid email format");
    } else if (data.email.length > 254) {
      errors.push("Email must be less than 254 characters");
    }
  }

  if (
    !data.company ||
    typeof data.company !== "string" ||
    data.company.trim().length === 0
  ) {
    errors.push("Company name is required");
  } else if (data.company.trim().length > 100) {
    errors.push("Company name must be less than 100 characters");
  }

  if (
    !data.message ||
    typeof data.message !== "string" ||
    data.message.trim().length === 0
  ) {
    errors.push("Message is required");
  } else if (data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  } else if (data.message.trim().length > 2000) {
    errors.push("Message must be less than 2000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

async function sendWebhook(
  data: ContactFormData,
  metadata: { ip: string; userAgent: string; timestamp: string },
) {
  // You can configure this webhook URL in environment variables
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("No webhook URL configured, logging contact form submission:", {
      ...data,
      metadata,
    });
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Gray Cup-Contact-Form/1.0",
      },
      body: JSON.stringify({
        type: "contact_form_submission",
        data,
        metadata,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("Webhook failed:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Webhook error:", error);
  }
}

export async function loader() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export async function action({ request, context }: Route.ActionArgs) {
  if (request.method === "PUT" || request.method === "DELETE") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const clientIP = getClientIP(request);

    const limited = await rateLimit(context, request, "contact");
    if (limited) return limited;

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return Response.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    // Validate input data
    const validation = validateContactData(body);
    if (!validation.isValid) {
      return Response.json(
        {
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 },
      );
    }

    // Sanitize data
    const contactData: ContactFormData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      company: body.company.trim(),
      companySize: body.companySize || "",
      message: body.message.trim(),
    };

    // Prepare metadata
    const userAgent = request.headers.get("user-agent") || "unknown";
    const metadata = {
      ip: clientIP,
      userAgent,
      timestamp: new Date().toISOString(),
    };

    try {
      await sendWebhook(contactData, metadata);
    } catch (error) {
      console.error("Webhook sending failed:", error);
      return Response.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 },
      );
    }

    // Return success response
    return Response.json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Contact form API error:", error);

    return Response.json(
      {
        error: "Internal server error. Please try again later.",
      },
      { status: 500 },
    );
  }
}
