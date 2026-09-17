import { describe, expect, it } from "vitest";
import {
  LEAD_LIMITS,
  digestSinceDate,
  normalizeVacancyLeads,
  readVacancyLeadRecord,
} from "./leads";
import leadRecordFixture from "./fixtures/leadRecord.json";

const emptyLead = {
  title: "",
  endClient: "",
  intermediary: "",
  contractForm: "",
  location: "",
  workMode: "",
  hoursPerWeek: "",
  startDate: "",
  durationMonths: "",
  extensionOptions: "",
  closingDate: "",
  rate: { minimum: null, maximum: null, unit: "", currency: "" },
  contact: { name: "", email: "", phone: "", organisation: "" },
};

const record = {
  sessionId: "session-id-value-1",
  sessionIds: ["session-id-value-0", "session-id-value-1"],
  lead: {
    ...emptyLead,
    title: "Senior frontend engineer",
    endClient: "A government body",
    intermediary: "An agency",
    contractForm: "freelance",
    location: "Utrecht",
    workMode: "hybrid",
    hoursPerWeek: "36",
    startDate: "2026-10-01",
    durationMonths: "12",
    extensionOptions: "two times six months",
    closingDate: "2026-09-21",
    rate: { minimum: 95, maximum: 125, unit: "hour", currency: "EUR" },
    contact: {
      name: "A recruiter",
      email: "recruiter@example.com",
      phone: "+31 6 1234 5678",
      organisation: "An agency",
    },
  },
  verdictCounts: { inRecord: 8, partly: 2, notInRecord: 1 },
  notInRecord: ["Salesforce Commerce Cloud"],
  requesterEmailDomain: "example.com",
  seenCount: 2,
  firstSeenAt: "2026-09-17T09:12:44.000Z",
  lastSeenAt: "2026-09-17T14:03:10.000Z",
};

const emptyRecord = {
  sessionId: "session-id-value-1",
  sessionIds: [],
  lead: emptyLead,
  verdictCounts: { inRecord: 0, partly: 0, notInRecord: 0 },
  notInRecord: [],
  requesterEmailDomain: "",
  seenCount: 0,
  firstSeenAt: "",
  lastSeenAt: "",
};

describe("normalizeVacancyLeads", () => {
  it("reads a plain array and an object with a leads field", () => {
    expect(normalizeVacancyLeads([record])).toEqual([record]);
    expect(normalizeVacancyLeads({ leads: [record] })).toEqual([record]);
  });

  it("answers an empty list for anything else", () => {
    expect(normalizeVacancyLeads(null)).toEqual([]);
    expect(normalizeVacancyLeads("nonsense")).toEqual([]);
    expect(normalizeVacancyLeads({ records: [record] })).toEqual([]);
  });

  it("drops entries without a session id", () => {
    expect(normalizeVacancyLeads([{ lead: { title: "No session" } }, "text", null, record])).toEqual(
      [record]
    );
  });

  it("fills every missing field with an empty value", () => {
    expect(normalizeVacancyLeads([{ sessionId: "session-id-value-1" }])).toEqual([emptyRecord]);
  });

  it("refuses a rate or a count that is not a usable number", () => {
    const [normalized] = normalizeVacancyLeads([
      {
        sessionId: "session-id-value-1",
        lead: { rate: { minimum: "nonsense", maximum: -3, unit: 7, currency: null } },
        verdictCounts: { inRecord: "nonsense", partly: -1, notInRecord: 2.7 },
      },
    ]);
    expect(normalized!.lead.rate).toEqual({
      minimum: null,
      maximum: null,
      unit: "7",
      currency: "",
    });
    expect(normalized!.verdictCounts).toEqual({ inRecord: 0, partly: 0, notInRecord: 2 });
  });

  it("caps the text of a field and the number of leads", () => {
    const [normalized] = normalizeVacancyLeads([
      { sessionId: "session-id-value-1", lead: { title: "a".repeat(400) } },
    ]);
    expect(normalized!.lead.title).toHaveLength(LEAD_LIMITS.text);

    const many = Array.from({ length: LEAD_LIMITS.leads + 10 }, () => record);
    expect(normalizeVacancyLeads(many)).toHaveLength(LEAD_LIMITS.leads);
  });
});

describe("readVacancyLeadRecord", () => {
  it("reads the golden lead record of the agent", () => {
    const read = readVacancyLeadRecord(leadRecordFixture);
    expect(read?.sessionId).toBe("hR2m9QpLtVwXyZ04");
    expect(read?.sessionIds).toEqual(["b7Kd2NfWq8sTzA31", "hR2m9QpLtVwXyZ04"]);
    expect(read?.lead.title).toBe("Senior frontend engineer InnovatieLab");
    expect(read?.lead.endClient).toBe("Kamer van Koophandel");
    expect(read?.lead.intermediary).toBe("Inhuurdesk KVK");
    expect(read?.lead.contractForm).toBe("freelance");
    expect(read?.lead.closingDate).toBeTruthy();
    expect(read?.lead.hoursPerWeek).toBe("36");
    expect(read?.lead.rate).toEqual({
      minimum: 95,
      maximum: 120,
      unit: "hour",
      currency: "EUR",
    });
    expect(read?.lead.contact.organisation).toBe("Kamer van Koophandel");
    expect(read?.verdictCounts).toEqual({ inRecord: 2, partly: 1, notInRecord: 1 });
    expect(read?.notInRecord).toEqual(["Je hebt een afgeronde WO-opleiding"]);
    expect(read?.requesterEmailDomain).toBe("example.org");
    expect(read?.seenCount).toBe(2);
  });

  it("refuses anything without a session id", () => {
    expect(readVacancyLeadRecord(null)).toBeNull();
    expect(readVacancyLeadRecord({ lead: { title: "No session" } })).toBeNull();
  });

  it("caps the list of requirements the check did not find", () => {
    const read = readVacancyLeadRecord({
      sessionId: "session-id-value-1",
      notInRecord: [...Array.from({ length: 40 }, () => "A requirement"), ""],
      sessionIds: "not a list",
    });
    expect(read?.notInRecord).toHaveLength(LEAD_LIMITS.requirements);
    expect(read?.sessionIds).toEqual([]);
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
