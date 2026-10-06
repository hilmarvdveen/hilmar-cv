import { describe, expect, it } from "vitest";
import { answerWithBookingAnchor, plainAnswer, splitAnswer } from "./faqBookingLink";

describe("splitAnswer", () => {
  it("returns a plain answer as one text part", () => {
    expect(splitAnswer("Immediately.")).toEqual([{ kind: "text", text: "Immediately." }]);
  });

  it("splits the booking link out of the surrounding text", () => {
    expect(splitAnswer("Immediately. <book>Book a call</book>")).toEqual([
      { kind: "text", text: "Immediately. " },
      { kind: "booking", text: "Book a call" },
    ]);
  });

  it("keeps text that follows the booking link", () => {
    expect(splitAnswer("<book>Book a call</book> today.")).toEqual([
      { kind: "booking", text: "Book a call" },
      { kind: "text", text: " today." },
    ]);
  });
});

describe("plainAnswer", () => {
  it("keeps the link label and drops the booking tag", () => {
    expect(plainAnswer("Immediately. <book>Book a call</book>.")).toBe("Immediately. Book a call.");
  });
});

describe("answerWithBookingAnchor", () => {
  it("turns the booking tag into an anchor to the booking page", () => {
    expect(
      answerWithBookingAnchor("Immediately. <book>Book a call</book>", "https://example.com/en/book")
    ).toBe('Immediately. <a href="https://example.com/en/book">Book a call</a>');
  });

  it("leaves an answer without the tag unchanged", () => {
    expect(answerWithBookingAnchor("Immediately.", "https://example.com/en/book")).toBe("Immediately.");
  });
});
