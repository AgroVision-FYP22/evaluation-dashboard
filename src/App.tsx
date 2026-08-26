import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import MetricsPanel from './components/MetricsPanel';
import AgentFlowVisualizer from './components/AgentFlowVisualizer';
import ResponseDetails from './components/ResponseDetails';
import SessionManager from './components/SessionManager';
import { DashboardData } from './types/dashboardTypes';
import { ApiError, apiClient } from './services/apiClient';
import {
  SessionEntry,
  loadSessions,
  newSessionId,
  recordTurn,
  removeSession,
} from './services/sessionStore';

function App() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  const handleChatSubmit = useCallback(
    async (message: string, imageUrl?: string) => {
      setIsLoading(true);
      setError(null);
      // First message in a fresh tab creates the session id; subsequent turns
      // reuse it so the engine keeps conversation memory across the thread.
      const sessionId = currentSession ?? newSessionId();
      if (!currentSession) setCurrentSession(sessionId);
      try {
        const data = await apiClient.chat(message, sessionId, imageUrl);
        setSessions(recordTurn(data.sessionId, message));
        setCurrentSession(data.sessionId);
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    },
    [currentSession],
  );

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSession(sessionId);
    setDashboardData(null);
    setError(null);
  };

  const handleNewSession = () => {
    setCurrentSession(newSessionId());
    setDashboardData(null);
    setError(null);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await apiClient.deleteSession(sessionId); // also clears engine-side memory
    } catch {
      // Engine unreachable: still remove locally — an orphaned checkpoint is
      // harmless for evaluation.
    }
    setSessions(removeSession(sessionId));
    if (currentSession === sessionId) {
      setCurrentSession(null);
      setDashboardData(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AgroVision Evaluation Dashboard</h1>
        {currentSession && (
          <span className="session-badge">session: {currentSession}</span>
        )}
      </header>

      <div className="app-body">
        <div className="sidebar">
          <SessionManager
            sessions={sessions}
            currentSession={currentSession}
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
          />
        </div>

        <div className="main-content">
          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          <ChatInterface
            onChatSubmit={handleChatSubmit}
            isLoading={isLoading}
          />

          {dashboardData && (
            <>
              <ResponseDetails
                response={dashboardData.response}
                citations={dashboardData.citations}
                stateSnapshot={dashboardData.stateSnapshot}
              />
              <MetricsPanel
                metrics={dashboardData.metrics}
                agentPerformance={dashboardData.agentPerformance}
                stateSnapshot={dashboardData.stateSnapshot}
              />
              <AgentFlowVisualizer
                agentExecution={dashboardData.agentExecution}
              />
            </>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>AgroVision Evaluation Dashboard v1.0</p>
      </footer>
    </div>
  );
}

export default App;
