"use client";

import { useEffect, useState } from "react";

const MILLISECONDS_IN_A_SECOND = 1_000;

export const useSecondsSince = (startedAt: number | null): number => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (startedAt === null) return;
    const clock = setInterval(() => setNow(Date.now()), MILLISECONDS_IN_A_SECOND);
    return () => clearInterval(clock);
  }, [startedAt]);

  if (startedAt === null) return 0;
  return Math.max(0, Math.floor((now - startedAt) / MILLISECONDS_IN_A_SECOND));
};
