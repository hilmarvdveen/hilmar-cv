export const TURNSTILE_TOKEN_FIELD = "cf-turnstile-response";

export function turnstileTokenFrom(form: HTMLFormElement): string {
  const token = new FormData(form).get(TURNSTILE_TOKEN_FIELD);
  return typeof token === "string" ? token : "";
}
