import type { LeadInput } from "./hcp";

type Deps = { fetch: typeof fetch; apiKey: string; to: string };

/**
 * Emails the print lead details to LEAD_NOTIFY_EMAIL via SendGrid's HTTP API.
 */
export async function sendLeadEmail(
  input: LeadInput,
  deps: Deps
): Promise<boolean> {
  try {
    const r = await deps.fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${deps.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: deps.to }] }],
        from: { email: "website@houstonitsecurity.net" },
        subject: `New Print Quote Request: ${input.name}`,
        content: [
          {
            type: "text/plain",
            value: `Name: ${input.name}\nPhone: ${input.phone}\nEmail: ${input.email ?? "-"}\nAddress/Delivery: ${input.address ?? "-"}\nProject Details: ${input.problem}\nSource: ${input.source ?? "-"}`,
          },
        ],
      }),
    });
    return r.ok;
  } catch (err) {
    console.error("sendLeadEmail failed:", err);
    return false;
  }
}
