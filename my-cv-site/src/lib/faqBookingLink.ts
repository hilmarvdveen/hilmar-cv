const BOOKING_LINK_PATTERN = /<book>(.*?)<\/book>/g;

export type AnswerPart = { kind: "text" | "booking"; text: string };

export function splitAnswer(answer: string): AnswerPart[] {
  const parts: AnswerPart[] = [];
  let position = 0;
  for (const match of answer.matchAll(BOOKING_LINK_PATTERN)) {
    if (match.index > position) {
      parts.push({ kind: "text", text: answer.slice(position, match.index) });
    }
    parts.push({ kind: "booking", text: match[1] });
    position = match.index + match[0].length;
  }
  if (position < answer.length) {
    parts.push({ kind: "text", text: answer.slice(position) });
  }
  return parts;
}

export function plainAnswer(answer: string): string {
  return answer.replace(BOOKING_LINK_PATTERN, "$1");
}

export function answerWithBookingAnchor(answer: string, bookingUrl: string): string {
  return answer.replace(BOOKING_LINK_PATTERN, `<a href="${bookingUrl}">$1</a>`);
}
