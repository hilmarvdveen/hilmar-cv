import { Button } from "@/components/Button";

// Rendered for unmatched routes within a locale. Next returns HTTP 404 here,
// which search engines treat as non-indexable automatically.
export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-bold text-emerald-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Page not found · Pagina niet gevonden
      </h1>
      <p className="mt-3 max-w-md text-gray-600">
        The page you’re looking for doesn’t exist or has moved. · De pagina die
        je zoekt bestaat niet of is verplaatst.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button href="/" variant="primary" size="md" className="rounded-xl">
          Back to home · Terug naar home
        </Button>
        <Button
          href="/contact"
          variant="outline"
          size="md"
          className="rounded-xl"
        >
          Contact
        </Button>
      </div>
    </main>
  );
}
