/** Dates behind the live numbers on the Status screen. */
export const MSC_START = new Date(2026, 6, 1); // Jul 2026
export const MSC_END = new Date(2027, 9, 31); // Oct 2027

/** Percentage of the MSc completed on a given day, 0 to 100. */
export function mscProgress(now = new Date()) {
  const pct = ((now - MSC_START) / (MSC_END - MSC_START)) * 100;
  return Math.max(0, Math.min(100, pct));
}
