type AdminEmailPurpose = "invite" | "reset";

export function isAdminPasswordEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
    (process.env.AUTH_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL) &&
    process.env.APP_BASE_URL
  );
}

export async function sendAdminPasswordEmail(email: string, token: string, purpose: AdminEmailPurpose) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_FROM_EMAIL ?? process.env.CONTACT_FROM_EMAIL;
  const appUrl = process.env.APP_BASE_URL;
  if (!apiKey || !from || !appUrl) throw new Error("Admin password email is not configured.");

  const base = new URL(appUrl);
  if (base.protocol !== "https:" && base.hostname !== "localhost") {
    throw new Error("APP_BASE_URL must use HTTPS outside localhost.");
  }
  const link = new URL(`/admin/reset-password?token=${encodeURIComponent(token)}`, base).toString();
  const subject = purpose === "invite" ? "Set up your club admin account" : "Reset your club admin password";
  const action = purpose === "invite" ? "set up your password" : "reset your password";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject,
      text: `Use this link to ${action}. It expires in 30 minutes and can only be used once:\n\n${link}\n\nIf you did not expect this email, you can ignore it.`,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Admin password email delivery failed (${response.status}).`);
}
