import type { Route } from "./+types/webhooks.feature";

export async function action({ request }: Route.ActionArgs) {
  // This should be your Discord webhook URL for feature requests
  const DISCORD_WEBHOOK_URL = process.env.DISCORD_FEATURE_WEBHOOK_URL;

  try {
    const body = await request.json();
    const { message, email, twitter } = body;

    if (!message || !email) {
      return Response.json(
        { error: "Message and email are required" },
        { status: 400 },
      );
    }

    if (!DISCORD_WEBHOOK_URL) {
      console.error("Discord webhook URL is not configured");
      return Response.json(
        { error: "Webhook not configured" },
        { status: 500 },
      );
    }

    // Format the message for Discord
    const discordMessage = {
      embeds: [
        {
          title: "🚀 New Feature Request",
          color: 3447003, // Blue color
          fields: [
            {
              name: "Feature Request",
              value: message,
            },
            {
              name: "Contact",
              value: `Email: ${email}\nTwitter: ${twitter || "Not provided"}`,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Send to Discord webhook
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook error: ${response.statusText}`);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error sending to Discord webhook:", error);
    return Response.json(
      { error: "Failed to send to Discord" },
      { status: 500 },
    );
  }
}
