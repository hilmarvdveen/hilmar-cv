import { isValidEmail } from "@/lib/security/validate";

export type BookingDetailsInput = {
  name: string;
  email: string;
};

export type DetailsField = keyof BookingDetailsInput;

export type DetailsErrorCode = "nameRequired" | "emailRequired" | "emailInvalid";

export type DetailsErrors = Partial<Record<DetailsField, DetailsErrorCode>>;

export function validateDetails(input: BookingDetailsInput): DetailsErrors {
  const errors: DetailsErrors = {};
  if (input.name.trim().length === 0) errors.name = "nameRequired";
  const email = input.email.trim();
  if (email.length === 0) errors.email = "emailRequired";
  else if (!isValidEmail(email)) errors.email = "emailInvalid";
  return errors;
}

export function firstInvalidField(errors: DetailsErrors): DetailsField | null {
  const order: DetailsField[] = ["name", "email"];
  return order.find((field) => errors[field] !== undefined) ?? null;
}
