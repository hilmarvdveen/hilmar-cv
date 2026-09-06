import { useTranslations } from "next-intl";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";

type ChannelCopy = {
  label: string;
  hint: string;
};

const CHANNEL_LINK_CLASS_NAME =
  "flex h-full items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 text-gray-900 shadow-sm transition-colors hover:border-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

export const ContactChannels = () => {
  const t = useTranslations("contact");
  const rawCopy = (t.raw("direct.items") as ChannelCopy[] | undefined) ?? [];
  const copy = [0, 1, 2].map((index) => rawCopy[index] ?? { label: "", hint: "" });
  const channels = [
    {
      copy: copy[0],
      value: BUSINESS_PROFILE.CONTACT.EMAIL,
      href: `mailto:${BUSINESS_PROFILE.CONTACT.EMAIL}`,
      Icon: Mail,
      external: false,
      placement: "contact-email",
    },
    {
      copy: copy[1],
      value: BUSINESS_PROFILE.CONTACT.PHONE_DISPLAY,
      href: `tel:${BUSINESS_PROFILE.CONTACT.PHONE}`,
      Icon: Phone,
      external: false,
      placement: "contact-phone",
    },
    {
      copy: copy[2],
      value: BUSINESS_PROFILE.CONTACT.PHONE_DISPLAY,
      href: BUSINESS_PROFILE.CONTACT.WHATSAPP,
      Icon: MessageCircle,
      external: true,
      placement: "contact-whatsapp-card",
    },
  ];

  return (
    <Section padding="compact" aria-labelledby="contact-channels-heading">
      <Container width="narrow">
        <h2 id="contact-channels-heading" className="sr-only">
          {t("direct.title")}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {channels.map(({ copy: channel, value, href, Icon, external, placement }) => (
            <li key={placement}>
              <a
                href={href}
                className={CHANNEL_LINK_CLASS_NAME}
                data-placement={placement}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{channel.label}</span>
                  <span className="block break-words text-sm text-gray-700 sm:text-sm">{value}</span>
                  <span className="mt-1 block text-xs text-gray-500">{channel.hint}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
};
