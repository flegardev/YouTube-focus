import {
  type DistractionMetrics,
  type FeedBlockRule,
  type FocusSession,
  type VideoCategory
} from "../types/focus";

const PRODUCTIVE_CATEGORIES: ReadonlySet<VideoCategory> = new Set([
  "PROGRAMMING_AND_TECH",
  "SCIENCE_AND_MATH",
  "ACADEMIC_LECTURE",
  "LANGUAGE_LEARNING"
]);

/**
 * Determines whether a YouTube video or channel is permitted during active focus mode
 */
export function isContentAllowedDuringFocus(
  category: VideoCategory,
  channelId: string,
  rules: FeedBlockRule
): boolean {
  // If channel is explicitly in allowlist, allow it
  if (rules.allowedChannelIds.includes(channelId)) {
    return true;
  }

  // If shorts tab is blocked and category is shorts, block it
  if (rules.blockShortsTab && category === "SHORTS_ALGORITHM") {
    return false;
  }

  // Allow only educational/productive categories during strict focus
  return PRODUCTIVE_CATEGORIES.has(category);
}

/**
 * Calculates aggregate productivity metrics, time saved, and efficiency rating
 */
export function computeDistractionMetrics(
  sessions: readonly FocusSession[]
): DistractionMetrics {
  if (sessions.length === 0) {
    return {
      totalFocusHours: 0,
      totalDistractionsBlocked: 0,
      estimatedTimeSavedMinutes: 0,
      focusEfficiencyRatio: 100
    };
  }

  let totalElapsedSeconds = 0;
  let totalDistractionsBlocked = 0;
  let completedCount = 0;

  for (const s of sessions) {
    totalElapsedSeconds += s.elapsedSeconds;
    totalDistractionsBlocked += s.distractionAttemptsBlocked;
    if (s.state === "COMPLETED") {
      completedCount += 1;
    }
  }

  const totalFocusHours = Number((totalElapsedSeconds / 3600).toFixed(2));
  // Each blocked rabbit-hole attempt saves an estimated 12 minutes of mindless scrolling
  const estimatedTimeSavedMinutes = totalDistractionsBlocked * 12;

  // Efficiency ratio: (completed / total) * 100 penalized by high interruptions
  const completionRatio = (completedCount / sessions.length) * 100;
  const focusEfficiencyRatio = Number(
    Math.max(0, Math.min(100, completionRatio)).toFixed(1)
  );

  return {
    totalFocusHours,
    totalDistractionsBlocked,
    estimatedTimeSavedMinutes,
    focusEfficiencyRatio
  };
}

/**
 * Ticks an active focus session by deltaSeconds and handles state completion
 */
export function tickFocusSession(
  session: FocusSession,
  deltaSeconds: number = 1
): FocusSession {
  if (session.state !== "FOCUSING") {
    return session;
  }

  const targetSeconds = session.targetDurationMinutes * 60;
  const newElapsed = session.elapsedSeconds + deltaSeconds;

  if (newElapsed >= targetSeconds) {
    return {
      ...session,
      elapsedSeconds: targetSeconds,
      state: "COMPLETED",
      completedAt: Date.now()
    };
  }

  return {
    ...session,
    elapsedSeconds: newElapsed
  };
}
