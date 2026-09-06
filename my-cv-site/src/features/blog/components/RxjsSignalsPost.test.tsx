import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./RxjsSignalsPost";

describe("RxjsSignalsPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("rxjs-versus-signals-in-angular");
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("is published on the frontend track with the architecture category", () => {
    expect(meta.track).toBe("frontend");
    expect(meta.category).toBe("architecture");
    expect(meta.publishedDate).toBe("2026-09-06");
    expect(meta.readingTimeMin).toBe(14);
  });

  it("names the current Angular release in both locales", () => {
    expect(meta.description.en).toContain("Angular 22");
    expect(meta.description.nl).toContain("Angular 22");
    expect(meta.excerpt.en).toContain("RxJS 7.8");
    expect(meta.excerpt.nl).toContain("RxJS 7.8");
  });

  it("renders the English body with every section, both diagrams and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "What RxJS still does that signals do not" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "A migration path for an Angular 12 codebase" })
    ).toBeInTheDocument();

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(12);
  });

  it("carries the date of the version check and both diagram captions in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/Angular 22 and RxJS 7.8, the pairing Angular 22 declares in its peer dependencies, checked on 6 September 2026/)
    ).toBeInTheDocument();
    expect(
      screen.getByText("A signal is a value you read now. A stream is a sequence you react to over time.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "toObservable opens the stream, the operators do the timing work, toSignal closes it again for the template."
      )
    ).toBeInTheDocument();
  });

  it("cites the engagements the record names, in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/At Athlon I led the migration of a self-service application from Angular 1.6 to Angular 12/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I took him by the hand through RxJS and streams, which was the hardest part for him/)
    ).toBeInTheDocument();
  });

  it("renders the Dutch body with every section, both diagrams and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 2, name: "Wat RxJS nog steeds doet en signals niet" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Een migratiepad voor een Angular 12-codebase" })
    ).toBeInTheDocument();

    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(12);
  });

  it("carries the date of the version check and both diagram captions in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(/Angular 22 en RxJS 7.8, de combinatie die Angular 22 in zijn peer dependencies vastlegt, gecontroleerd op 6 september 2026/)
    ).toBeInTheDocument();
    expect(
      screen.getByText("Een signal is een waarde die je nu leest. Een stream is een reeks waar je in de tijd op reageert.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "toObservable opent de stream, de operators doen het timingwerk, toSignal sluit hem weer voor de template."
      )
    ).toBeInTheDocument();
  });

  it("cites the engagements the record names, in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(/Bij Athlon leidde ik de migratie van een selfserviceapplicatie van Angular 1.6 naar Angular 12/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ik nam hem bij de hand door RxJS en streams, voor hem het lastigste onderdeel/)
    ).toBeInTheDocument();
  });
});
