const MONTH_INDEX: Readonly<Record<string, number>> = {
  january: 0,
  januari: 0,
  february: 1,
  februari: 1,
  march: 2,
  maart: 2,
  april: 3,
  may: 4,
  mei: 4,
  june: 5,
  juni: 5,
  july: 6,
  juli: 6,
  august: 7,
  augustus: 7,
  september: 8,
  october: 9,
  oktober: 9,
  november: 10,
  december: 11,
};

const MONTH_NAMES = Object.keys(MONTH_INDEX).join("|");

const AVAILABILITY_DATE = new RegExp(
  `\\b(?:(?:available|availability|start\\w*|beschikbaar\\w*|beginnen)\\b[^.?!]{0,40}?|(?:from|vanaf|before|voor) )(\\d{1,2}) (${MONTH_NAMES})\\b(?: (\\d{4}))?`,
  "gi",
);

function startOfDay(moment: Date): number {
  return Date.UTC(moment.getUTCFullYear(), moment.getUTCMonth(), moment.getUTCDate());
}

export function pastAvailabilityDates(text: string, today: Date): string[] {
  const todayStart = startOfDay(today);
  return [...text.matchAll(AVAILABILITY_DATE)]
    .filter(([, day, month, year]) => {
      const fullYear = year ? Number(year) : today.getUTCFullYear();
      return Date.UTC(fullYear, MONTH_INDEX[month.toLowerCase()], Number(day)) < todayStart;
    })
    .map(([phrase]) => phrase);
}

export function isPastStartDate(startDate: string | null, today: Date): boolean {
  return startDate !== null && Date.parse(startDate) < startOfDay(today);
}
