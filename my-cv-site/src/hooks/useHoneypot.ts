import { useEffect, useRef, useState } from "react";
import { HONEYPOT_FIELD } from "@/lib/security/honeypot";

/**
 * Client-side companion to the server honeypot/timing checks.
 * Tracks the decoy field value and the moment the form mounted, and builds
 * the extra payload fields that every protected form must send.
 */
export function useHoneypot() {
  const [value, setValue] = useState("");
  const formStartedAt = useRef<number | null>(null);

  // Stamp the mount time in an effect (not during render) so the hook stays
  // pure — render must not call impure functions like Date.now().
  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  const payload = (): Record<string, unknown> => ({
    [HONEYPOT_FIELD]: value,
    // Falls back to submit time if the effect somehow hasn't run yet.
    formStartedAt: formStartedAt.current ?? Date.now(),
  });

  return { value, setValue, payload };
}
