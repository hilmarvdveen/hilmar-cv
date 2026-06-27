import type { LegalDoc } from "../legalContent";

type LegalDocumentProps = {
  doc: LegalDoc;
  /** Localized "Last updated" label. */
  lastUpdatedLabel: string;
};

export function LegalDocument({ doc, lastUpdatedLabel }: LegalDocumentProps) {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{doc.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          {lastUpdatedLabel}: {doc.lastUpdated}
        </p>

        <div className="bg-white rounded-lg p-8 space-y-8">
          {doc.intro && <p className="text-gray-700 leading-relaxed">{doc.intro}</p>}

          {doc.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {section.heading}
              </h2>
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="text-gray-700 leading-relaxed mb-3">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {section.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
