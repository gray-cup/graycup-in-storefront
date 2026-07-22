import "server-only";
import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL || "Gray Cup <onboarding@resend.dev>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("RESEND_API_KEY is not set — transactional email will not be sent");
    return null;
  }
  return new Resend(key);
}

// better-auth's sendVerificationEmail/sendResetPassword hooks don't get retried on
// failure, and a thrown error here would surface as a sign-up/reset failure to the
// buyer even though their account/token was created fine — so these never throw.
async function send(to: string, subject: string, html: string) {
  const resend = getResend();
  if (!resend) return;
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) console.error("Resend send failed:", error);
  } catch (err) {
    console.error("Resend send threw:", err);
  }
}

export async function sendVerificationEmail(to: string, name: string, url: string) {
  await send(
    to,
    "Verify your email — Gray Cup",
    `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>Hi ${name || "there"},</h2>
      <p>Confirm your email address to finish setting up your Gray Cup account.</p>
      <p><a href="${url}" style="display:inline-block;background:#000;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Verify email</a></p>
      <p style="color:#888;font-size:12px">If you didn't create this account, you can ignore this email.</p>
    </div>`,
  );
}

export async function sendPasswordResetEmail(to: string, name: string, url: string) {
  await send(
    to,
    "Reset your password — Gray Cup",
    `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>Hi ${name || "there"},</h2>
      <p>Someone requested a password reset for your Gray Cup account. If this was you, click below to set a new password — this link expires in 1 hour.</p>
      <p><a href="${url}" style="display:inline-block;background:#000;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Reset password</a></p>
      <p style="color:#888;font-size:12px">If you didn't request this, you can safely ignore this email — your password will not change.</p>
    </div>`,
  );
}
