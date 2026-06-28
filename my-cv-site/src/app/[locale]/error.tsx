"use client";

import { useEffect } from "react";
import { Button } from "@/components/Button";

// Route-level error boundary for the localized app. Client component per Next.js.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        Something went wrong · Er ging iets mis
      </h1>
      <p className="mt-3 max-w-md text-gray-600">
        Please try again. · Probeer het opnieuw.
      </p>
      <Button
        onClick={reset}
        variant="primary"
        size="md"
        className="mt-8 rounded-xl"
      >
        Try again · Opnieuw proberen
      </Button>
    </main>
  );
}
