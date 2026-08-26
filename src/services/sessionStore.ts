// src/services/sessionStore.ts
// Client-side chat-session registry. The engine has no listing endpoint; it
// holds conversation *memory* keyed by session_id — this store only remembers
// which sessions exist so the dashboard can list and resume them.

export interface SessionEntry {
  id: string;
  title: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'agrovision-eval-sessions';

export function newSessionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function loadSessions(): SessionEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SessionEntry[]) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: SessionEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

/** Record a turn against a session, creating the entry on its first turn. */
export function recordTurn(sessionId: string, userMessage: string): SessionEntry[] {
  const sessions = loadSessions();
  const now = new Date().toISOString();
  const existing = sessions.find((s) => s.id === sessionId);
  let updated: SessionEntry;
  if (existing) {
    updated = { ...existing, lastMessage: userMessage, updatedAt: now };
  } else {
    updated = {
      id: sessionId,
      title: userMessage.length > 60 ? `${userMessage.slice(0, 57)}...` : userMessage,
      lastMessage: userMessage,
      createdAt: now,
      updatedAt: now,
    };
  }
  const next = [updated, ...sessions.filter((s) => s.id !== sessionId)];
  next.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  saveSessions(next);
  return next;
}

/** Remove a session locally. Returns the updated list. */
export function removeSession(sessionId: string): SessionEntry[] {
  const next = loadSessions().filter((s) => s.id !== sessionId);
  saveSessions(next);
  return next;
}
