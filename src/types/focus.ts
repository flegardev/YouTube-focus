import { z } from "zod";

export const VideoCategorySchema = z.enum([
  "PROGRAMMING_AND_TECH",
  "SCIENCE_AND_MATH",
  "ACADEMIC_LECTURE",
  "LANGUAGE_LEARNING",
  "ENTERTAINMENT",
  "SHORTS_ALGORITHM",
  "GAMING_STREAM",
  "POLITICAL_COMMENTARY"
]);
export type VideoCategory = z.infer<typeof VideoCategorySchema>;

export const FocusSessionStateSchema = z.enum([
  "IDLE",
  "FOCUSING",
  "ON_BREAK",
  "COMPLETED",
  "INTERRUPTED"
]);
export type FocusSessionState = z.infer<typeof FocusSessionStateSchema>;

/**
 * YouTube Feed & UI Element Blocking Rules
 */
export const FeedBlockRuleSchema = z.object({
  blockHomeFeed: z.boolean().default(true),
  blockSidebarRecommendations: z.boolean().default(true),
  blockCommentsSection: z.boolean().default(true),
  blockShortsTab: z.boolean().default(true),
  blockEndScreenCards: z.boolean().default(true),
  allowedChannelIds: z.array(z.string()).default([])
});
export type FeedBlockRule = z.infer<typeof FeedBlockRuleSchema>;

/**
 * Single Focus Session Entity
 */
export const FocusSessionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  targetDurationMinutes: z.number().int().min(1).max(300),
  elapsedSeconds: z.number().int().min(0),
  state: FocusSessionStateSchema,
  distractionAttemptsBlocked: z.number().int().min(0).default(0),
  educationalMinutesWatched: z.number().min(0).default(0),
  startedAt: z.number().int().positive(),
  completedAt: z.number().int().positive().optional()
});
export type FocusSession = z.infer<typeof FocusSessionSchema>;

/**
 * Algorithmic Distraction & Time Saved Analytics
 */
export const DistractionMetricsSchema = z.object({
  totalFocusHours: z.number().min(0),
  totalDistractionsBlocked: z.number().int().min(0),
  estimatedTimeSavedMinutes: z.number().min(0),
  focusEfficiencyRatio: z.number().min(0).max(100), // percentage
  topAllowedCategory: VideoCategorySchema.optional()
});
export type DistractionMetrics = z.infer<typeof DistractionMetricsSchema>;
