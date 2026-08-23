import { describe, it, expect } from "vitest";
import { contactChannelSchema } from "../../lib/validation/schemas";

describe("Contact Channel Validation Rules", () => {
  it("should PASS when channel status is OFF even if URL is simple/empty", () => {
    const data = {
      platform: "ZALO",
      label: "Zalo",
      url: "https://zalo.me/0902081061",
      status: false,
      displayOrder: 1,
      openInNewTab: true,
    };
    const result = contactChannelSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("should FAIL when channel status is ON but URL is invalid or empty", () => {
    const data = {
      platform: "ZALO",
      label: "Zalo",
      url: "not-a-valid-url",
      status: true,
      displayOrder: 1,
      openInNewTab: true,
    };
    const result = contactChannelSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should PASS when channel status is ON and valid URL is provided", () => {
    const data = {
      platform: "FACEBOOK",
      label: "Facebook",
      url: "https://facebook.com/luatsulethingocloi",
      status: true,
      displayOrder: 1,
      openInNewTab: true,
    };
    const result = contactChannelSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
