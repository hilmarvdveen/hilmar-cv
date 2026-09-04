import { useTranslations } from "next-intl";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";

const CHANNEL_LINK_CLASS_NAME =
  "flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:border-emerald-600 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

export const ContactChannels = () => {
  const t = useTranslations("contact");

  return (
    <Section padding="compact" aria-labelledby="contact-channels-heading">
      <Container width="narrow">
        <h2 id="contact-channels-heading" className="sr-only">
          {t("direct.title")}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          <li>
            <a
              href={`mailto:${BUSINESS_PROFILE.CONTACT.EMAIL}`}
              className={CHANNEL_LINK_CLASS_NAME}
            >
              <Mail className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <span className="min-w-0 break-words text-[13px] sm:text-sm">
                {BUSINESS_PROFILE.CONTACT.EMAIL}
              </span>
            </a>
          </li>
          <li>
            <a
              href={`tel:${BUSINESS_PROFILE.CONTACT.PHONE}`}
              className={CHANNEL_LINK_CLASS_NAME}
            >
              <Phone className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <span>{BUSINESS_PROFILE.CONTACT.PHONE_DISPLAY}</span>
            </a>
          </li>
          <li>
            <a
              href={BUSINESS_PROFILE.CONTACT.WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className={CHANNEL_LINK_CLASS_NAME}
            >
              <MessageSquare className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          </li>
        </ul>
      </Container>
    </Section>
  );
};
