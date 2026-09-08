export const SLOT_MINUTES = 30;
export const SLOTS_PER_DAY = 16;
export const WORKDAY_START_HOUR = 9;
export const MINIMUM_NOTICE_MINUTES = 60;

export function lastSlotStartMinutes(): number {
  return WORKDAY_START_HOUR * 60 + (SLOTS_PER_DAY - 1) * SLOT_MINUTES;
}
