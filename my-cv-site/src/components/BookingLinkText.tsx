import { Link } from "@/i18n/navigation";
import { splitAnswer } from "@/lib/bookingLink";

const BOOKING_LINK_CLASS =
  "rounded-sm font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800 focus-ring";

type BookingLinkTextProps = {
  text: string;
};

export function BookingLinkText({ text }: BookingLinkTextProps) {
  return (
    <>
      {splitAnswer(text).map((part, partIndex) =>
        part.kind === "booking" ? (
          <Link key={partIndex} href="/book" className={BOOKING_LINK_CLASS}>
            {part.text}
          </Link>
        ) : (
          part.text
        )
      )}
    </>
  );
}
