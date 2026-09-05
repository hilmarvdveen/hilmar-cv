import { useEffect, useRef, useState } from "react";
import { HONEYPOT_FIELD } from "@/lib/security/honeypot";

export function useHoneypot() {
  const [value, setValue] = useState("");
  const formStartedAt = useRef<number | null>(null);

  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  const payload = (): Record<string, unknown> => ({
    [HONEYPOT_FIELD]: value,
    formStartedAt: formStartedAt.current ?? Date.now(),
  });

  return { value, setValue, payload };
}
