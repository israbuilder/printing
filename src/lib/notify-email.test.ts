import { describe, it, expect, vi } from "vitest";
import { sendLeadEmail } from "./notify-email";

describe("sendLeadEmail", () => {
  it("sends an email with the lead details", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    const ok = await sendLeadEmail(
      { name: "Jane", phone: "713", problem: "Custom shirts" },
      { fetch: fetchMock, apiKey: "sg", to: "houstonitbrenda@gmail.com" }
    );
    expect(ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.sendgrid.com/v3/mail/send",
      expect.objectContaining({ method: "POST" })
    );
  });
});
