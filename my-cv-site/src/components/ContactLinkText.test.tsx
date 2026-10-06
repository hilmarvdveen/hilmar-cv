import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactLinkText } from "./ContactLinkText";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";

const { EMAIL, PHONE, PHONE_DISPLAY } = BUSINESS_PROFILE.CONTACT;

describe("ContactLinkText", () => {
  it("turns the email address and the phone number into links inside the sentence", () => {
    render(
      <p>
        <ContactLinkText text={`Try again, or email ${EMAIL} or call ${PHONE_DISPLAY}.`} />
      </p>
    );
    expect(screen.getByRole("link", { name: EMAIL })).toHaveAttribute("href", `mailto:${EMAIL}`);
    expect(screen.getByRole("link", { name: PHONE_DISPLAY })).toHaveAttribute("href", `tel:${PHONE}`);
    expect(screen.getByRole("link", { name: EMAIL }).parentElement).toHaveTextContent(
      `Try again, or email ${EMAIL} or call ${PHONE_DISPLAY}.`
    );
  });

  it("leaves a sentence without contact details as plain text", () => {
    render(
      <p>
        <ContactLinkText text="Wait a minute and try again." />
      </p>
    );
    expect(screen.getByText("Wait a minute and try again.")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
