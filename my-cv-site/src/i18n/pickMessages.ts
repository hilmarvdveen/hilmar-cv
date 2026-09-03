type Messages = Record<string, unknown>;

export const CLIENT_MESSAGE_KEYS = [
  "common",
  "booking",
  "contact",
  "cvModal",
  "faq",
  "breadcrumb",
  "home.map",
  "search",
] as const;

const readPath = (source: Messages, path: string[]): unknown =>
  path.reduce<unknown>(
    (value, key) => (value && typeof value === "object" ? (value as Messages)[key] : undefined),
    source
  );

const writePath = (target: Messages, path: string[], value: unknown) => {
  let cursor = target;
  for (const key of path.slice(0, -1)) {
    const existing = cursor[key];
    if (!existing || typeof existing !== "object") cursor[key] = {};
    cursor = cursor[key] as Messages;
  }
  cursor[path[path.length - 1]] = value;
};

export const pickMessages = (messages: Messages, keys: readonly string[]): Messages => {
  const picked: Messages = {};
  for (const key of keys) {
    const path = key.split(".");
    const value = readPath(messages, path);
    if (value !== undefined) writePath(picked, path, value);
  }
  return picked;
};
