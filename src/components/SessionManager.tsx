// src/components/SessionManager.tsx
import React from 'react';
import './SessionManager.css';

interface Session {
  id: string;
  title: string;
  date: string;
  lastMessage: string;
}

interface SessionManagerProps {
  currentSession: string | null;
  onSessionSelect: (sessionId: string) => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({ 
  currentSession, 
  onSessionSelect 
}) => {
  // Mock session data - this would be replaced with actual API calls
  const sessions: Session[] = [
    {
      id: 'session-1',
      title: 'Soil Analysis for Rice Field',
      date: '2026-08-20',
      lastMessage: 'What is the soil pH level?'
    },
    {
      id: 'session-2',
      title: 'Weather Impact Assessment',
      date: '2026-08-19',
      lastMessage: 'How will the weather affect my crops?'
    },
    {
      id: 'session-3',
      title: 'Disease Prevention Plan',
      date: '2026-08-18',
      lastMessage: 'What diseases are common in this area?'
    },
    {
      id: 'session-4',
      title: 'Fertilizer Recommendation',
      date: '2026-08-17',
      lastMessage: 'What fertilizer should I use?'
    }
  ];

  return (
    <div className="session-manager">
      <div className="session-header">
        <h3>Session History</h3>
      </div>
      <div className="session-list">
        {sessions.map((session) => (
          <div 
            key={session.id}
            className={`session-item ${currentSession === session.id ? 'active' : ''}`}
            onClick={() => onSessionSelect(session.id)}
          >
            <h4>{session.title}</h4>
            <p className="date">{session.date}</p>
            <p className="last-message">{session.lastMessage}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionManager;