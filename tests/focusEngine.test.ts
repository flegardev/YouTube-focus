import { describe, it, expect } from "vitest";
import {
  isContentAllowedDuringFocus,
  computeDistractionMetrics,
  tickFocusSession
} from "../src/services/focusEngine";
import {
  type FeedBlockRule,
  type FocusSession,
  FocusSessionSchema,
  FeedBlockRuleSchema
} from "../src/types/focus";

describe("YouTube Focus Productivity Engine", () => {
  const defaultRules: FeedBlockRule = {
    blockHomeFeed: true,
    blockSidebarRecommendations: true,
    blockCommentsSection: true,
    blockShortsTab: true,
    blockEndScreenCards: true,
    allowedChannelIds: ["channel-mit-opencourseware"]
  };

  describe("Content Filtering & Category Validation", () => {
    it("should allow educational and programming content during active focus", () => {
      expect(isContentAllowedDuringFocus("PROGRAMMING_AND_TECH", "other-ch", defaultRules)).toBe(true);
      expect(isContentAllowedDuringFocus("SCIENCE_AND_MATH", "other-ch", defaultRules)).toBe(true);
      expect(isContentAllowedDuringFocus("ACADEMIC_LECTURE", "other-ch", defaultRules)).toBe(true);
    });

    it("should block entertainment and algorithmic shorts by default", () => {
      expect(isContentAllowedDuringFocus("ENTERTAINMENT", "random-ch", defaultRules)).toBe(false);
      expect(isContentAllowedDuringFocus("SHORTS_ALGORITHM", "random-ch", defaultRules)).toBe(false);
      expect(isContentAllowedDuringFocus("GAMING_STREAM", "random-ch", defaultRules)).toBe(false);
    });

    it("should allow any category if the channel is explicitly allowlisted", () => {
      expect(
        isContentAllowedDuringFocus("ENTERTAINMENT", "channel-mit-opencourseware", defaultRules)
      ).toBe(true);
    });
  });

  describe("Focus Session Ticking & State Machine", () => {
    it("should increment elapsed seconds during FOCUSING state", () => {
      const initial: FocusSession = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Deep Work Coding",
        targetDurationMinutes: 25,
        elapsedSeconds: 0,
        state: "FOCUSING",
        distractionAttemptsBlocked: 0,
        educationalMinutesWatched: 0,
        startedAt: 1700000000000
      };

      const ticked = tickFocusSession(initial, 60);
      expect(ticked.elapsedSeconds).toBe(60);
      expect(ticked.state).toBe("FOCUSING");
    });

    it("should transition to COMPLETED when target duration is reached", () => {
      const initial: FocusSession = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Sprint Review",
        targetDurationMinutes: 1, // 60 seconds
        elapsedSeconds: 59,
        state: "FOCUSING",
        distractionAttemptsBlocked: 2,
        educationalMinutesWatched: 0,
        startedAt: 1700000000000
      };

      const ticked = tickFocusSession(initial, 1);
      expect(ticked.elapsedSeconds).toBe(60);
      expect(ticked.state).toBe("COMPLETED");
      expect(ticked.completedAt).toBeDefined();
      expect(() => FocusSessionSchema.parse(ticked)).not.toThrow();
    });
  });

  describe("Distraction Metrics & Time Saved Aggregation", () => {
    it("should calculate total focus hours and estimated time saved", () => {
      const sessions: FocusSession[] = [
        {
          id: "123e4567-e89b-12d3-a456-426614174001",
          title: "Math Study",
          targetDurationMinutes: 60,
          elapsedSeconds: 3600,
          state: "COMPLETED",
          distractionAttemptsBlocked: 3,
          educationalMinutesWatched: 60,
          startedAt: 1700000000000
        },
        {
          id: "123e4567-e89b-12d3-a456-426614174002",
          title: "TypeScript Deep Dive",
          targetDurationMinutes: 30,
          elapsedSeconds: 1800,
          state: "COMPLETED",
          distractionAttemptsBlocked: 2,
          educationalMinutesWatched: 30,
          startedAt: 1700003600000
        }
      ];

      const metrics = computeDistractionMetrics(sessions);
      expect(metrics.totalFocusHours).toBe(1.5); // 5400 / 3600
      expect(metrics.totalDistractionsBlocked).toBe(5);
      expect(metrics.estimatedTimeSavedMinutes).toBe(60); // 5 * 12 mins
      expect(metrics.focusEfficiencyRatio).toBe(100);
    });
  });

  describe("Zod Rules Validation", () => {
    it("should validate default feed blocking rules schema", () => {
      expect(() => FeedBlockRuleSchema.parse(defaultRules)).not.toThrow();
    });
  });
});
