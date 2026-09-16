import { describe, expect, it } from "vitest";
import { LEAD_LIMITS, digestSinceDate, normalizeVacancyLeads } from "./leads";

const lead = {
  sessionId: "session-id-value-1",
  title: "Senior frontend engineer",
  endClient: "A government body",
  intermediary: "An agency",
  contractForm: "freelance",
  location: "Utrecht",
  closingDate: "2026-09-21",
  rate: { minimum: 95, maximum: 125, unit: "hour", currency: "EUR" },
  contact: {
    name: "A recruiter",
    email: "recruiter@example.com",
    phone: "+31 6 1234 5678",
    organisation: "An agency",
  },
  verdictCounts: { inRecord: 8, partly: 2, notInRecord: 1 },
};

describe("normalizeVacancyLeads", () => {
  it("reads a plain array and an object with a leads field", () => {
    expect(normalizeVacancyLeads([lead])).toEqual([lead]);
    expect(normalizeVacancyLeads({ leads: [lead] })).toEqual([lead]);
  });

  it("answers an empty list for anything else", () => {
    expect(normalizeVacancyLeads(null)).toEqual([]);
    expect(normalizeVacancyLeads("nonsense")).toEqual([]);
    expect(normalizeVacancyLeads({ records: [lead] })).toEqual([]);
  });

  it("drops entries without a session id", () => {
    expect(normalizeVacancyLeads([{ title: "No session" }, "text", null, lead])).toEqual([lead]);
  });

  it("fills every missing field with an empty value", () => {
    expect(normalizeVacancyLeads([{ sessionId: "session-id-value-1" }])).toEqual([
      {
        sessionId: "session-id-value-1",
        title: "",
        endClient: "",
        intermediary: "",
        contractForm: "",
        location: "",
        closingDate: "",
        rate: { minimum: null, maximum: null, unit: "", currency: "" },
        contact: { name: "", email: "", phone: "", organisation: "" },
        verdictCounts: { inRecord: 0, partly: 0, notInRecord: 0 },
      },
    ]);
  });

  it("refuses a rate or a count that is not a usable number", () => {
    const [normalized] = normalizeVacancyLeads([
      {
        sessionId: "session-id-value-1",
        rate: { minimum: "nonsense", maximum: -3, unit: 7, currency: null },
        verdictCounts: { inRecord: "nonsense", partly: -1, notInRecord: 2.7 },
      },
    ]);
    expect(normalized.rate).toEqual({ minimum: null, maximum: null, unit: "", currency: "" });
    expect(normalized.verdictCounts).toEqual({ inRecord: 0, partly: 0, notInRecord: 2 });
  });

  it("caps the text of a field and the number of leads", () => {
    const [normalized] = normalizeVacancyLeads([
      { sessionId: "session-id-value-1", title: "a".repeat(400) },
    ]);
    expect(normalized.title).toHaveLength(LEAD_LIMITS.text);

    const many = Array.from({ length: LEAD_LIMITS.leads + 10 }, () => lead);
    expect(normalizeVacancyLeads(many)).toHaveLength(LEAD_LIMITS.leads);
  });
});

describe("digestSinceDate", () => {
  it("looks back seven days by default", () => {
    expect(digestSinceDate(new Date("2026-09-21T07:15:00Z"))).toBe("2026-09-14");
  });

  it("takes another window", () => {
    expect(digestSinceDate(new Date("2026-09-21T07:15:00Z"), 1)).toBe("2026-09-20");
  });
});
