/**
 * Legal page content (EN/NL).
 *
 * TEMPLATE — drafted from GDPR (Art. 12–14), the Dutch Telecommunicatiewet
 * (art. 11.7a) / AVG, and Autoriteit Persoonsgegevens (AP) cookie guidance.
 * It reflects what this site actually does (contact / CV / booking forms via
 * Microsoft 365, consent-gated Google Analytics, cookieless Vercel Analytics).
 * Have it reviewed by a qualified lawyer before relying on it, and add your
 * KvK number / registered address if you operate a registered business.
 */

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDoc = {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
};

export type LegalSlug = "privacy" | "cookies" | "terms" | "disclaimer";
export type LegalLocale = "en" | "nl";

const CONTROLLER = "Hilmar van der Veen";
const EMAIL = "hilmar@hilmarvanderveen.com";
const SITE = "www.hilmarvanderveen.com";
const LOCATION_EN = "Amsterdam, the Netherlands";
const LOCATION_NL = "Amsterdam, Nederland";
const UPDATED_EN = "27 June 2026";
const UPDATED_NL = "27 juni 2026";
const AP_EN = "the Dutch Data Protection Authority (Autoriteit Persoonsgegevens, autoriteitpersoonsgegevens.nl)";
const AP_NL = "de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl)";

export const LEGAL_CONTENT: Record<LegalSlug, Record<LegalLocale, LegalDoc>> = {
  privacy: {
    en: {
      title: "Privacy Policy",
      lastUpdated: UPDATED_EN,
      intro: `This Privacy Policy explains how ${CONTROLLER} ("I", "me") processes your personal data when you use ${SITE}. I act as the data controller. You can reach me at ${EMAIL}.`,
      sections: [
        {
          heading: "What data I collect and why",
          paragraphs: [
            "I only collect personal data that you actively provide through one of the forms on this site, plus limited technical and analytics data:",
          ],
          bullets: [
            "Contact form — your name, email address, message and any topics you select, so I can answer your enquiry. Legal basis: your consent and/or taking steps at your request prior to entering into a contract (Art. 6(1)(a)/(b) GDPR).",
            "CV download — your name, email address and the purpose you select, so I know who is interested in my profile. Legal basis: your consent (Art. 6(1)(a) GDPR).",
            "Consultation booking — your name, email address, optional phone number and company, and the project details and time slot you choose, so I can schedule and prepare our meeting. Legal basis: steps prior to a contract and my legitimate interest in managing bookings (Art. 6(1)(b)/(f) GDPR).",
            "Analytics — aggregated, statistical usage data (see the Cookie Policy). Legal basis: your consent for cookie-based analytics; legitimate interest for privacy-friendly, cookieless measurement.",
          ],
        },
        {
          heading: "Who receives your data",
          paragraphs: ["I do not sell your data. I share it only with service providers that help me run this site, acting as processors under a data processing agreement:"],
          bullets: [
            "Microsoft (Microsoft 365 / Microsoft Graph) — to deliver form submissions to my mailbox and to create calendar bookings.",
            "Vercel — hosting of this website (privacy-friendly, cookieless analytics).",
            "Google — Google Analytics / Tag Manager, only after you consent to analytics cookies.",
          ],
        },
        {
          heading: "International transfers",
          paragraphs: [
            "Some of these providers (e.g. Microsoft and Google) may process data outside the European Economic Area, including in the United States. Where that happens, transfers are covered by appropriate safeguards such as the EU Standard Contractual Clauses and/or the EU–US Data Privacy Framework.",
          ],
        },
        {
          heading: "How long I keep your data",
          paragraphs: [
            "I keep enquiry and booking data only for as long as needed to handle your request and any follow-up, and to meet legal obligations. When it is no longer needed, I delete it. You can ask me to delete it sooner at any time.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: ["Under the GDPR you have the right to:"],
          bullets: [
            "access the personal data I hold about you;",
            "have inaccurate data corrected;",
            "have your data erased;",
            "restrict or object to processing;",
            "receive your data in a portable format;",
            "withdraw consent at any time (this does not affect processing before withdrawal).",
          ],
        },
        {
          heading: "Contact and complaints",
          paragraphs: [
            `To exercise any of these rights, email me at ${EMAIL}. Providing your data is voluntary, but without it I cannot answer your enquiry or arrange a booking.`,
            `If you believe your data is handled incorrectly, you have the right to lodge a complaint with ${AP_EN}.`,
          ],
        },
        {
          heading: "Automated decision-making",
          paragraphs: ["I do not use automated decision-making or profiling that produces legal or similarly significant effects."],
        },
        {
          heading: "Changes",
          paragraphs: ["I may update this policy. The date above shows the latest version."],
        },
      ],
    },
    nl: {
      title: "Privacyverklaring",
      lastUpdated: UPDATED_NL,
      intro: `Deze privacyverklaring legt uit hoe ${CONTROLLER} ("ik") jouw persoonsgegevens verwerkt wanneer je ${SITE} gebruikt. Ik ben de verwerkingsverantwoordelijke. Je kunt mij bereiken via ${EMAIL}.`,
      sections: [
        {
          heading: "Welke gegevens ik verzamel en waarom",
          paragraphs: [
            "Ik verzamel alleen persoonsgegevens die je zelf via een formulier op deze site verstrekt, plus beperkte technische en analytische gegevens:",
          ],
          bullets: [
            "Contactformulier — je naam, e-mailadres, bericht en eventueel gekozen onderwerpen, zodat ik je vraag kan beantwoorden. Grondslag: jouw toestemming en/of stappen op jouw verzoek vóór een eventuele overeenkomst (art. 6 lid 1 a/b AVG).",
            "CV-download — je naam, e-mailadres en het gekozen doel, zodat ik weet wie interesse heeft in mijn profiel. Grondslag: jouw toestemming (art. 6 lid 1 a AVG).",
            "Afspraak inplannen — je naam, e-mailadres, optioneel telefoonnummer en bedrijf, en de projectdetails en het tijdslot dat je kiest, zodat ik onze afspraak kan plannen en voorbereiden. Grondslag: stappen vóór een overeenkomst en mijn gerechtvaardigd belang bij het beheren van afspraken (art. 6 lid 1 b/f AVG).",
            "Statistieken — geaggregeerde, statistische gebruiksgegevens (zie het Cookiebeleid). Grondslag: jouw toestemming voor analytische cookies; gerechtvaardigd belang voor privacyvriendelijke, cookieloze meting.",
          ],
        },
        {
          heading: "Wie jouw gegevens ontvangt",
          paragraphs: ["Ik verkoop je gegevens niet. Ik deel ze alleen met dienstverleners die mij helpen deze site te laten werken, als verwerker onder een verwerkersovereenkomst:"],
          bullets: [
            "Microsoft (Microsoft 365 / Microsoft Graph) — om formulierinzendingen in mijn mailbox te bezorgen en afspraken in de agenda te zetten.",
            "Vercel — hosting van deze website (privacyvriendelijke, cookieloze statistieken).",
            "Google — Google Analytics / Tag Manager, alleen nadat je toestemming geeft voor analytische cookies.",
          ],
        },
        {
          heading: "Doorgifte buiten de EER",
          paragraphs: [
            "Sommige van deze partijen (bijv. Microsoft en Google) kunnen gegevens buiten de Europese Economische Ruimte verwerken, waaronder in de Verenigde Staten. Waar dat gebeurt, gelden passende waarborgen zoals de EU-modelcontractbepalingen en/of het EU–US Data Privacy Framework.",
          ],
        },
        {
          heading: "Hoe lang ik je gegevens bewaar",
          paragraphs: [
            "Ik bewaar gegevens uit aanvragen en afspraken niet langer dan nodig om je verzoek en eventuele opvolging af te handelen en om aan wettelijke verplichtingen te voldoen. Daarna verwijder ik ze. Je kunt mij altijd vragen ze eerder te verwijderen.",
          ],
        },
        {
          heading: "Jouw rechten",
          paragraphs: ["Op grond van de AVG heb je het recht om:"],
          bullets: [
            "de persoonsgegevens die ik over je heb in te zien;",
            "onjuiste gegevens te laten corrigeren;",
            "je gegevens te laten verwijderen;",
            "de verwerking te beperken of er bezwaar tegen te maken;",
            "je gegevens in een overdraagbaar formaat te ontvangen;",
            "je toestemming op elk moment in te trekken (dit raakt niet de verwerking vóór de intrekking).",
          ],
        },
        {
          heading: "Contact en klachten",
          paragraphs: [
            `Om een van deze rechten uit te oefenen, mail mij via ${EMAIL}. Het verstrekken van je gegevens is vrijwillig, maar zonder die gegevens kan ik je vraag niet beantwoorden of een afspraak inplannen.`,
            `Als je vindt dat je gegevens niet goed worden verwerkt, heb je het recht een klacht in te dienen bij ${AP_NL}.`,
          ],
        },
        {
          heading: "Geautomatiseerde besluitvorming",
          paragraphs: ["Ik gebruik geen geautomatiseerde besluitvorming of profilering met rechtsgevolgen of vergelijkbare gevolgen."],
        },
        {
          heading: "Wijzigingen",
          paragraphs: ["Ik kan deze verklaring bijwerken. De datum hierboven toont de meest recente versie."],
        },
      ],
    },
  },

  cookies: {
    en: {
      title: "Cookie Policy",
      lastUpdated: UPDATED_EN,
      intro: `This Cookie Policy explains how ${SITE} uses cookies and similar technologies, in line with the Dutch Telecommunications Act (art. 11.7a) and the GDPR/AVG.`,
      sections: [
        {
          heading: "What cookies are",
          paragraphs: [
            "Cookies are small files stored on your device. This site also uses your browser's local storage, which works similarly. Below I explain what is stored and why.",
          ],
        },
        {
          heading: "Functional storage (no consent required)",
          bullets: [
            "ga-consent (local storage) — remembers your cookie choice so you are not asked again.",
            "Booking form draft (local storage) — temporarily keeps what you typed in the booking form so you don't lose it. Stored only in your browser; never sent unless you submit.",
          ],
        },
        {
          heading: "Analytics (consent required)",
          paragraphs: [
            "Only after you press \"Accept\" do I load Google Analytics / Google Tag Manager to understand, in aggregate, how the site is used. These set cookies such as _ga and _ga_<id> (typically valid up to ~13 months) and are provided by Google.",
            "I also use Vercel Web Analytics and Speed Insights, which measure usage and performance without cookies and without tracking you across sites.",
          ],
        },
        {
          heading: "Your choice",
          paragraphs: [
            "When you first visit, a banner lets you Accept or Decline analytics cookies — declining is as easy as accepting, and the site works fully either way. Google Analytics is only loaded after you accept.",
            "You can change your mind at any time by clearing this site's cookies and local storage in your browser, which makes the banner appear again.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [`Questions about cookies? Email ${EMAIL}.`],
        },
      ],
    },
    nl: {
      title: "Cookiebeleid",
      lastUpdated: UPDATED_NL,
      intro: `Dit cookiebeleid legt uit hoe ${SITE} cookies en vergelijkbare technieken gebruikt, conform de Telecommunicatiewet (art. 11.7a) en de AVG.`,
      sections: [
        {
          heading: "Wat cookies zijn",
          paragraphs: [
            "Cookies zijn kleine bestanden die op je apparaat worden opgeslagen. Deze site gebruikt ook de local storage van je browser, die vergelijkbaar werkt. Hieronder leg ik uit wat wordt opgeslagen en waarom.",
          ],
        },
        {
          heading: "Functionele opslag (geen toestemming nodig)",
          bullets: [
            "ga-consent (local storage) — onthoudt je cookiekeuze zodat je het niet opnieuw gevraagd wordt.",
            "Concept boekingsformulier (local storage) — bewaart tijdelijk wat je in het boekingsformulier typt zodat het niet verloren gaat. Alleen in je browser opgeslagen; pas verzonden als je verstuurt.",
          ],
        },
        {
          heading: "Statistieken (toestemming vereist)",
          paragraphs: [
            "Pas nadat je op \"Accepteren\" klikt, laad ik Google Analytics / Google Tag Manager om geaggregeerd te begrijpen hoe de site wordt gebruikt. Deze plaatsen cookies zoals _ga en _ga_<id> (doorgaans geldig tot ~13 maanden) en worden geleverd door Google.",
            "Daarnaast gebruik ik Vercel Web Analytics en Speed Insights, die gebruik en prestaties meten zonder cookies en zonder je over sites heen te volgen.",
          ],
        },
        {
          heading: "Jouw keuze",
          paragraphs: [
            "Bij je eerste bezoek kun je in een balk analytische cookies Accepteren of Weigeren — weigeren is net zo eenvoudig als accepteren, en de site werkt in beide gevallen volledig. Google Analytics wordt pas geladen nadat je accepteert.",
            "Je kunt je keuze altijd wijzigen door de cookies en local storage van deze site in je browser te wissen; dan verschijnt de balk opnieuw.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [`Vragen over cookies? Mail naar ${EMAIL}.`],
        },
      ],
    },
  },

  terms: {
    en: {
      title: "Terms of Use",
      lastUpdated: UPDATED_EN,
      intro: `These terms govern your use of the website ${SITE}. By using the site you agree to them. They cover the website only — any paid work is governed by a separate written agreement.`,
      sections: [
        {
          heading: "Use of the site",
          paragraphs: [
            "You may view and use this site for lawful, personal and business-information purposes. You may not misuse it, attempt to disrupt it, or use it in a way that infringes the rights of others or applicable law.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            `All content on this site — text, design, code, logos and images — belongs to ${CONTROLLER} unless stated otherwise, and is protected by intellectual-property law. You may not copy, redistribute or reuse it without prior written permission, except for normal personal viewing.`,
          ],
        },
        {
          heading: "No warranties",
          paragraphs: [
            "The site and its content are provided \"as is\", without warranties of any kind. I make reasonable efforts to keep information accurate and the site available, but do not guarantee that it is error-free or uninterrupted.",
          ],
        },
        {
          heading: "Limitation of liability",
          paragraphs: [
            "To the extent permitted by law, I am not liable for any damage arising from the use of, or inability to use, this site. Nothing in these terms limits liability for intent or gross negligence, or any liability that cannot be excluded under Dutch law.",
          ],
        },
        {
          heading: "External links",
          paragraphs: [
            "This site may link to third-party sites. I am not responsible for their content or practices; visiting them is at your own risk.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            `These terms are governed by Dutch law. Any dispute will be submitted to the competent court in the district of Amsterdam, ${LOCATION_EN}.`,
          ],
        },
        {
          heading: "Changes and contact",
          paragraphs: [
            `I may update these terms; the date above shows the latest version. Questions? Email ${EMAIL}.`,
          ],
        },
      ],
    },
    nl: {
      title: "Gebruiksvoorwaarden",
      lastUpdated: UPDATED_NL,
      intro: `Deze voorwaarden gelden voor je gebruik van de website ${SITE}. Door de site te gebruiken ga je ermee akkoord. Ze gaan alleen over de website — betaald werk valt onder een aparte schriftelijke overeenkomst.`,
      sections: [
        {
          heading: "Gebruik van de site",
          paragraphs: [
            "Je mag deze site bekijken en gebruiken voor rechtmatige, persoonlijke en zakelijke informatiedoeleinden. Je mag de site niet misbruiken, verstoren, of gebruiken op een manier die de rechten van anderen of de wet schendt.",
          ],
        },
        {
          heading: "Intellectueel eigendom",
          paragraphs: [
            `Alle inhoud op deze site — tekst, ontwerp, code, logo's en afbeeldingen — is van ${CONTROLLER}, tenzij anders vermeld, en wordt beschermd door intellectueel-eigendomsrecht. Je mag het niet kopiëren, verspreiden of hergebruiken zonder voorafgaande schriftelijke toestemming, behalve voor normaal persoonlijk gebruik.`,
          ],
        },
        {
          heading: "Geen garanties",
          paragraphs: [
            "De site en de inhoud worden geleverd \"zoals ze zijn\", zonder enige garantie. Ik doe redelijke inspanningen om informatie juist te houden en de site beschikbaar te houden, maar garandeer niet dat deze foutloos of ononderbroken is.",
          ],
        },
        {
          heading: "Beperking van aansprakelijkheid",
          paragraphs: [
            "Voor zover wettelijk toegestaan ben ik niet aansprakelijk voor schade die voortvloeit uit het gebruik van, of het niet kunnen gebruiken van, deze site. Niets in deze voorwaarden beperkt aansprakelijkheid voor opzet of bewuste roekeloosheid, of aansprakelijkheid die naar Nederlands recht niet kan worden uitgesloten.",
          ],
        },
        {
          heading: "Externe links",
          paragraphs: [
            "Deze site kan linken naar sites van derden. Ik ben niet verantwoordelijk voor hun inhoud of werkwijze; bezoek is op eigen risico.",
          ],
        },
        {
          heading: "Toepasselijk recht",
          paragraphs: [
            `Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement Amsterdam, ${LOCATION_NL}.`,
          ],
        },
        {
          heading: "Wijzigingen en contact",
          paragraphs: [
            `Ik kan deze voorwaarden bijwerken; de datum hierboven toont de meest recente versie. Vragen? Mail ${EMAIL}.`,
          ],
        },
      ],
    },
  },

  disclaimer: {
    en: {
      title: "Disclaimer",
      lastUpdated: UPDATED_EN,
      intro: `The information on ${SITE} is provided by ${CONTROLLER} for general information purposes.`,
      sections: [
        {
          heading: "No professional advice",
          paragraphs: [
            "Content on this site, including articles and project descriptions, is general information and not professional, legal or technical advice for your specific situation. Always seek tailored advice before acting on it.",
          ],
        },
        {
          heading: "Accuracy",
          paragraphs: [
            "I take care to keep the information correct and up to date, but cannot guarantee that everything is complete, accurate or current. Content may change without notice.",
          ],
        },
        {
          heading: "External links",
          paragraphs: [
            "Links to third-party websites are provided for convenience. I do not endorse and am not responsible for their content, accuracy or practices.",
          ],
        },
        {
          heading: "No liability",
          paragraphs: [
            "To the extent permitted by law, I accept no liability for any loss or damage arising from reliance on information on this site. This does not affect liability for intent or gross negligence.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [`Spotted something inaccurate? Let me know at ${EMAIL}.`],
        },
      ],
    },
    nl: {
      title: "Disclaimer",
      lastUpdated: UPDATED_NL,
      intro: `De informatie op ${SITE} wordt door ${CONTROLLER} verstrekt voor algemene informatiedoeleinden.`,
      sections: [
        {
          heading: "Geen professioneel advies",
          paragraphs: [
            "De inhoud op deze site, waaronder artikelen en projectbeschrijvingen, is algemene informatie en geen professioneel, juridisch of technisch advies voor jouw specifieke situatie. Win altijd advies op maat in voordat je erop handelt.",
          ],
        },
        {
          heading: "Juistheid",
          paragraphs: [
            "Ik doe mijn best om de informatie juist en actueel te houden, maar kan niet garanderen dat alles volledig, juist of actueel is. De inhoud kan zonder aankondiging wijzigen.",
          ],
        },
        {
          heading: "Externe links",
          paragraphs: [
            "Links naar websites van derden zijn er voor het gemak. Ik onderschrijf hun inhoud niet en ben niet verantwoordelijk voor hun juistheid of werkwijze.",
          ],
        },
        {
          heading: "Geen aansprakelijkheid",
          paragraphs: [
            "Voor zover wettelijk toegestaan aanvaard ik geen aansprakelijkheid voor verlies of schade door het vertrouwen op informatie op deze site. Dit raakt niet de aansprakelijkheid voor opzet of bewuste roekeloosheid.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [`Iets onjuists gezien? Laat het me weten via ${EMAIL}.`],
        },
      ],
    },
  },
};

export function getLegalDoc(slug: LegalSlug, locale: string): LegalDoc {
  const loc: LegalLocale = locale === "nl" ? "nl" : "en";
  return LEGAL_CONTENT[slug][loc];
}
