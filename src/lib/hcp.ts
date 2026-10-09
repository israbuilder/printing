export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  problem: string; // project details or print requirements
  source?: string;
};

type Deps = { fetch: typeof fetch; apiKey: string };

/**
 * Creates a customer/lead in the CRM backend from a website "Request Service / Quote" submission.
 */
export async function createHcpLead(input: LeadInput, deps: Deps) {
  const [first_name, ...rest] = input.name.trim().split(/\s+/);
  const body: Record<string, unknown> = {
    first_name,
    last_name: rest.join(" ") || "(web lead)",
    mobile_number: input.phone,
    email: input.email,
    notes: input.source
      ? `${input.problem}\n\nSource: ${input.source}`
      : input.problem,
    lead_source: input.source?.startsWith("openai")
      ? "Website — ChatGPT Ad"
      : "Website — Print Quote",
  };
  if (input.address) {
    body.addresses = [{ street: input.address }];
  }

  try {
    const r = await deps.fetch("https://api.housecallpro.com/customers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${deps.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) return { ok: false as const };
    const data = await r.json();
    return { ok: true as const, id: data.id as string };
  } catch (err) {
    console.error("createHcpLead failed:", err);
    return { ok: false as const };
  }
}
