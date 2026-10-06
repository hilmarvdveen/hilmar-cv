import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";

const CONTACT_LINK_CLASS =
  "rounded-sm font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

const CONTACT_LINKS: Record<string, string> = {
  [BUSINESS_PROFILE.CONTACT.EMAIL]: `mailto:${BUSINESS_PROFILE.CONTACT.EMAIL}`,
  [BUSINESS_PROFILE.CONTACT.PHONE_DISPLAY]: `tel:${BUSINESS_PROFILE.CONTACT.PHONE}`,
};

const escapeForPattern = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const CONTACT_PATTERN = new RegExp(
  `(${Object.keys(CONTACT_LINKS).map(escapeForPattern).join("|")})`
);

type ContactLinkTextProps = {
  text: string;
};

export function ContactLinkText({ text }: ContactLinkTextProps) {
  return (
    <>
      {text.split(CONTACT_PATTERN).map((part, partIndex) =>
        part in CONTACT_LINKS ? (
          <a key={partIndex} href={CONTACT_LINKS[part]} className={CONTACT_LINK_CLASS}>
            {part}
          </a>
        ) : (
          part
        )
      )}
    </>
  );
}
