import type { APIRoute } from "astro";

export const prerender = false;

const env = (key: string): string | undefined =>
  (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.[key] ??
  (import.meta.env as Record<string, string | undefined>)[key];

export const validCouponLead = (name: string, phone: string): boolean => {
  const digits = phone.replace(/\D/g, "");
  const national =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return name.trim().length > 0 && national.length === 10;
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim().slice(0, 100);
  const phone = String(form.get("phone") ?? "").trim();
  const source =
    String(form.get("lead_source") ?? "").trim().slice(0, 300) || undefined;

  if (!validCouponLead(name, phone)) {
    return json({ ok: false, error: "Missing or invalid name/phone" }, 400);
  }

  const base = env("HUGO_OPS_URL");
  const key = env("LEAD_CAPTURE_KEY");

  if (!base || !key) {
    // If ops service is not configured, grant coupon unlock directly
    return json({ ok: true, sms_sent: false }, 200);
  }

  const clientIp =
    request.headers.get("x-nf-client-connection-ip") ??
    (() => {
      try {
        return clientAddress;
      } catch {
        return "";
      }
    })();

  try {
    const r = await fetch(`${base}/api/marketing/coupon-lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Capture-Key": key,
        ...(clientIp ? { "X-Client-IP": clientIp } : {}),
      },
      body: JSON.stringify({ name, phone, source }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await r.json().catch(() => ({}))) as {
      ok?: boolean;
      sms_sent?: boolean;
    };
    return json(
      { ok: r.ok && data.ok === true, sms_sent: data.sms_sent === true },
      r.ok ? 200 : 200
    );
  } catch (err) {
    console.error("coupon-lead forward failed:", err);
    return json({ ok: true, sms_sent: false }, 200);
  }
};
