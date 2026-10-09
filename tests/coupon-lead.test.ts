import { describe, it, expect } from "vitest";
import { validCouponLead } from "../src/pages/api/coupon-lead";

describe("validCouponLead", () => {
  it("accepts a name and a 10-digit US phone in any format", () => {
    expect(validCouponLead("Maria G", "(832) 555-0142")).toBe(true);
    expect(validCouponLead("Bo", "832-555-0142")).toBe(true);
    expect(validCouponLead("Al", "18325550142")).toBe(true);
  });

  it("rejects a blank name", () => {
    expect(validCouponLead("   ", "8325550142")).toBe(false);
  });

  it("rejects a phone with fewer than 10 digits", () => {
    expect(validCouponLead("Maria", "555-0142")).toBe(false);
    expect(validCouponLead("Maria", "")).toBe(false);
  });
});
