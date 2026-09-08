import { describe, it, expect } from "vitest";
import { describeSecretExpiry } from "./watch";

const now = new Date("2026-09-08T18:00:00Z");

describe("describeSecretExpiry", () => {
  it("is unknown without a date or with a date in the wrong shape", () => {
    expect(describeSecretExpiry(undefined, now).level).toBe("unknown");
    expect(describeSecretExpiry("8 September 2026", now).level).toBe("unknown");
    expect(describeSecretExpiry("2026-13-45", now).level).toBe("unknown");
  });

  it("is expired the day after the date", () => {
    expect(describeSecretExpiry("2026-09-07", now)).toEqual({ level: "expired", daysLeft: -2, expiresOn: "2026-09-07" });
  });

  it("is urgent inside a week, soon inside a month, fine beyond", () => {
    expect(describeSecretExpiry("2026-09-15", now).level).toBe("urgent");
    expect(describeSecretExpiry("2026-10-01", now).level).toBe("soon");
    expect(describeSecretExpiry("2027-03-01", now)).toEqual({ level: "fine", daysLeft: 173, expiresOn: "2027-03-01" });
  });
});
