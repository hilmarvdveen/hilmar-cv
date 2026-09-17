const SENT_LINK_CAPACITY = 500;

const sentLinks = new Set<string>();

const pairKey = (sessionId: string, emailAddress: string): string =>
  `${sessionId}:${emailAddress.trim().toLowerCase()}`;

export function hasSentResultLink(sessionId: string, emailAddress: string): boolean {
  return sentLinks.has(pairKey(sessionId, emailAddress));
}

export function rememberSentResultLink(sessionId: string, emailAddress: string): void {
  const key = pairKey(sessionId, emailAddress);
  sentLinks.delete(key);
  sentLinks.add(key);
  for (const oldest of sentLinks) {
    if (sentLinks.size <= SENT_LINK_CAPACITY) return;
    sentLinks.delete(oldest);
  }
}

export function __resetSentResultLinks(): void {
  sentLinks.clear();
}
