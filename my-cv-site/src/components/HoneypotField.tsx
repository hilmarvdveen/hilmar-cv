import { useTranslations } from "next-intl";
import { HONEYPOT_FIELD } from "@/lib/security/honeypot";

type HoneypotFieldProps = {
  value: string;
  onChange: (value: string) => void;
}

export function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  const t = useTranslations("common");
  return (
    <div
      className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      aria-hidden="true"
    >
      <label htmlFor={HONEYPOT_FIELD}>{t("decoyField")}</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
