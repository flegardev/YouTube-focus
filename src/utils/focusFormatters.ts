/**
 * Formats seconds into MM:SS format for focus timer display
 */
export function formatFocusTimeRemaining(remainingSeconds: number): string {
  const safeSecs = Math.max(0, remainingSeconds);
  const mins = Math.floor(safeSecs / 60);
  const secs = safeSecs % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Formats minutes into human-readable hours and minutes (e.g. 2h 15m)
 */
export function formatHoursAndMinutes(totalMinutes: number): string {
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}
