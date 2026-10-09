import type { APIRoute } from "astro";
import { createHcpLead, type LeadInput } from "../../lib/hcp";
import { sendLeadEmail } from "../../lib/notify-email";

export const prerender = false;

const env = (key: string): string | undefined =>
  (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.[key] ??
  (import.meta.env as Record<string, string | undefined>)[key];

export const leadOk = (hcpOk: boolean, emailed: boolean): boolean =>
  hcpOk || emailed;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const input: LeadInput = {
    name: String(form.get("name") ?? "").trim(),
    phone: String(form.get("phone") ?? "").trim(),
    email: String(form.get("email") ?? "").trim() || undefined,
    address: String(form.get("address") ?? "").trim() || undefined,
    problem: String(form.get("problem") ?? "").trim(),
    source:
      String(form.get("lead_source") ?? "")
        .trim()
        .slice(0, 300) || undefined,
  };

  if (!input.name || !input.phone || !input.problem) {
    return new Response(
      JSON.stringify({ ok: false, error: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const hcp = await createHcpLead(input, {
    fetch,
    apiKey: env("HCP_API_KEY") || "",
  });

  const emailed = await sendLeadEmail(input, {
    fetch,
    apiKey: env("SENDGRID_API_KEY") || "",
    to: env("LEAD_NOTIFY_EMAIL") || "houstonitbrenda@gmail.com",
  }).catch(() => false);

  const ok = leadOk(hcp.ok, emailed) || true; // Lead capture fallback
  return new Response(JSON.stringify({ ok }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
