import { HONEYPOT_FIELD } from "@/lib/security/honeypot";

interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Visually-hidden decoy input. Real users never see or fill it; bots that
 * auto-complete every field will, which the API rejects. Kept out of the tab
 * order and hidden from assistive tech.
 */
export function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div
      className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      aria-hidden="true"
    >
      <label htmlFor={HONEYPOT_FIELD}>Company website (leave empty)</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
