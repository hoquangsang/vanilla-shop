import { describe, expect, it } from "vitest";
import { formatPrice } from "../../../src/core/format";

describe("formatPrice", () => {
  it("shows a $ sign and exactly two decimals", () => {
    expect(formatPrice(14)).toBe("$14.00");
    expect(formatPrice(35.5)).toBe("$35.50");
    expect(formatPrice(29.99)).toBe("$29.99");
  });
});
