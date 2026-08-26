// src/components/SessionManager.tsx
import React from 'react';
import './SessionManager.css';
import { SessionEntry } from '../services/sessionStore';

interface SessionManagerProps {
  sessions: SessionEntry[];
  currentSession: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({
  sessions,
  currentSession,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
}) => {
  return (
    <div className="session-manager">
      <div className="session-header">
        <h3>Session History</h3>
        <button className="new-session-btn" onClick={onNewSession}>
          + New
        </button>
      </div>
      <div className="session-list">
        {sessions.length === 0 && (
          <p className="session-empty">
            No sessions yet. Ask a question to start one — conversation memory is kept
            engine-side under the same session id.
          </p>
        )}
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`session-item ${currentSession === session.id ? 'active' : ''}`}
            onClick={() => onSessionSelect(session.id)}
          >
            <h4>{session.title}</h4>
            <p className="date">{new Date(session.updatedAt).toLocaleString()}</p>
            <p className="last-message">{session.lastMessage}</p>
            <button
              className="session-delete-btn"
              title="Delete session (clears engine-side memory too)"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionManager;
