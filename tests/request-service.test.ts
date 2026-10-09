import { describe, it, expect } from "vitest";
import { leadOk } from "../src/pages/api/request-service";

describe("leadOk", () => {
  it("is true when HCP succeeds (email irrelevant)", () => {
    expect(leadOk(true, false)).toBe(true);
    expect(leadOk(true, true)).toBe(true);
  });

  it("is true when only the email fallback succeeds", () => {
    expect(leadOk(false, true)).toBe(true);
  });

  it("is false only when BOTH channels fail", () => {
    expect(leadOk(false, false)).toBe(false);
  });
});
