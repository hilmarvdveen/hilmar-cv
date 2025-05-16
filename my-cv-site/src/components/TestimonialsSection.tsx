export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Annemieke Jansen",
      role: "Product Owner, Belastingdienst",
      quote:
        "Hilmar is een uitzonderlijk gedreven developer met oog voor detail én toegankelijkheid. Onze teams groeiden dankzij zijn begeleiding.",
    },
    {
      name: "Wouter de Vries",
      role: "Lead UX, Nationale Postcode Loterij",
      quote:
        "De samenwerking met Hilmar was een verademing. Zijn codekwaliteit en communicatie zijn van topniveau.",
    },
  ];

  return (
    <section className="bg-white py-16 px-6">
      <h2 className="text-2xl font-semibold mb-8 text-gray-900">
        Wat anderen zeggen
      </h2>
      <div className="space-y-8">
        {testimonials.map((t, i) => (
          <blockquote
            key={i}
            className="border-l-4 border-blue-500 pl-4 text-gray-700"
          >
            <p className="italic">“{t.quote}”</p>
            <footer className="mt-2 text-sm text-gray-600">
              — {t.name}, {t.role}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
};
