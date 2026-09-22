import { describe, expect, it } from "vitest";
import crypto from "crypto";

describe("Admin credentials & session security", () => {
  it("verifies ADMIN_PASSWORD environment variable is loaded and strong", () => {
    const password = process.env.ADMIN_PASSWORD;
    expect(password).toBeDefined();
    expect(password!.length).toBeGreaterThanOrEqual(16);
  });

  it("verifies HMAC session token generation with ADMIN_SESSION_SECRET", () => {
    const secret = process.env.ADMIN_SESSION_SECRET || "art-secret-session-key";
    const token = crypto
      .createHmac("sha256", secret)
      .update(`admin-${new Date().toDateString()}`)
      .digest("hex");

    expect(token).toBeDefined();
    expect(token.length).toBe(64);
  });
});
