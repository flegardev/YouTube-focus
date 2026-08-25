import { useState, useCallback, useEffect } from "react";
import { type FocusSession, type FeedBlockRule } from "../types/focus";
import { tickFocusSession } from "../services/focusEngine";

export function useFocusSession(initialRules?: Partial<FeedBlockRule>) {
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);
  const [rules, setRules] = useState<FeedBlockRule>({
    blockHomeFeed: true,
    blockSidebarRecommendations: true,
    blockCommentsSection: true,
    blockShortsTab: true,
    blockEndScreenCards: true,
    allowedChannelIds: [],
    ...initialRules
  });

  const startFocus = useCallback((title: string, durationMinutes: number = 25) => {
    setActiveSession({
      id: crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`,
      title,
      targetDurationMinutes: durationMinutes,
      elapsedSeconds: 0,
      state: "FOCUSING",
      distractionAttemptsBlocked: 0,
      educationalMinutesWatched: 0,
      startedAt: Date.now()
    });
  }, []);

  const pauseFocus = useCallback(() => {
    setActiveSession((prev) => (prev ? { ...prev, state: "ON_BREAK" } : null));
  }, []);

  const stopFocus = useCallback(() => {
    setActiveSession((prev) => (prev ? { ...prev, state: "INTERRUPTED" } : null));
  }, []);

  const recordBlockedAttempt = useCallback(() => {
    setActiveSession((prev) =>
      prev
        ? { ...prev, distractionAttemptsBlocked: prev.distractionAttemptsBlocked + 1 }
        : null
    );
  }, []);

  // Timer interval
  useEffect(() => {
    if (!activeSession || activeSession.state !== "FOCUSING") return;

    const interval = setInterval(() => {
      setActiveSession((prev) => (prev ? tickFocusSession(prev, 1) : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession?.state]);

  return {
    activeSession,
    rules,
    setRules,
    startFocus,
    pauseFocus,
    stopFocus,
    recordBlockedAttempt
  };
}
