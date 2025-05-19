export const CertificationsSection = () => {
  const certs = [
    {
      title: "React Advanced – Udemy",
      date: "2020",
    },
    {
      title: "Angular Advanced – Udemy",
      date: "2020",
    },
    {
      title: "70–483 Programming in C# – Young Capital",
      date: "2016",
    },
    {
      title: "Professional Scrum Master™ I Certification – Scrum.org",
      date: "2016",
    },
  ];

  return (
    <section className="bg-gray-100 py-16 px-6">
      <div className="container max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-gray-900">
          Certificeringen
        </h2>
        <ul className="list-disc list-inside text-gray-800 text-sm space-y-2">
          {certs.map((cert, i) => (
            <li key={i}>
              <strong>{cert.title}</strong>{" "}
              <span className="text-gray-600">({cert.date})</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
