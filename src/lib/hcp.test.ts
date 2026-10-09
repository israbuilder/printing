import { describe, it, expect, vi } from "vitest";
import { createHcpLead } from "./hcp";

describe("createHcpLead", () => {
  it("posts a customer to HCP and returns the id", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "cus_123" }),
    });
    const res = await createHcpLead(
      { name: "Jane Doe", phone: "7135551234", problem: "50 custom t-shirts" },
      { fetch: fetchMock, apiKey: "key_test" }
    );
    expect(res).toEqual({ ok: true, id: "cus_123" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.housecallpro.com/customers",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer key_test" }),
      })
    );
  });

  it("returns ok:false when HCP rejects", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 422, json: async () => ({}) });
    const res = await createHcpLead(
      { name: "X", phone: "1", problem: "y" },
      { fetch: fetchMock, apiKey: "k" }
    );
    expect(res.ok).toBe(false);
  });
});
