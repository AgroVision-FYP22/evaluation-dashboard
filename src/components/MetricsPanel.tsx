// src/components/MetricsPanel.tsx
// Honest metrics only: client-measured latency is always real. Token/call
// counts come from the engine's analytics block — when absent (engine without
// the patch), they render as unavailable instead of fabricated numbers.

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './MetricsPanel.css';
import { AgentPerformance, Metrics, StateSnapshot } from '../types/dashboardTypes';

interface MetricsPanelProps {
  metrics: Metrics;
  agentPerformance: Record<string, AgentPerformance>;
  stateSnapshot: StateSnapshot;
}

const NA = '—';

function fmt(n: number | null): string {
  return n === null ? NA : String(n);
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, agentPerformance, stateSnapshot }) => {
  const agents = Object.values(agentPerformance);
  const hasAnalytics = metrics.llmCalls !== null;

  const tokenData = agents
    .filter((a) => a.tokenUsage !== null)
    .map((a) => ({ name: a.agent, tokens: a.tokenUsage as number }));

  const llmCallsData = agents
    .filter((a) => a.llmCalls !== null)
    .map((a) => ({ name: a.agent, calls: a.llmCalls as number }));

  return (
    <div className="metrics-panel">
      <h2>Performance Metrics</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Response Time</h3>
          <div className="metric-value">{fmt(metrics.responseTime)} ms</div>
          <p className="metric-source">client-measured round trip</p>
        </div>
        <div className="metric-card">
          <h3>Total Tokens</h3>
          <div className={`metric-value ${metrics.totalTokens === null ? 'metric-na' : ''}`}>
            {fmt(metrics.totalTokens)}
          </div>
          <p className="metric-source">{hasAnalytics ? 'engine-reported' : 'not exposed by engine'}</p>
        </div>
        <div className="metric-card">
          <h3>LLM Calls</h3>
          <div className={`metric-value ${metrics.llmCalls === null ? 'metric-na' : ''}`}>
            {fmt(metrics.llmCalls)}
          </div>
          <p className="metric-source">{hasAnalytics ? 'engine-reported' : 'not exposed by engine'}</p>
        </div>
        <div className="metric-card">
          <h3>Tool Calls</h3>
          <div className={`metric-value ${metrics.toolCalls === null ? 'metric-na' : ''}`}>
            {fmt(metrics.toolCalls)}
          </div>
          <p className="metric-source">{hasAnalytics ? 'engine-reported' : 'not exposed by engine'}</p>
        </div>
      </div>

      <div className="snapshot-meta">
        <span><strong>Intent:</strong> {stateSnapshot.intent ?? NA}</span>
        <span><strong>Replans:</strong> {stateSnapshot.replan_count}</span>
        <span><strong>Retries:</strong> {stateSnapshot.retry_count}</span>
        <span>
          <strong>Judge:</strong>{' '}
          <span className={stateSnapshot.judge_verdict?.startsWith('APPROVED') ? 'verdict-approved' : 'verdict-rejected'}>
            {stateSnapshot.judge_verdict ?? NA}
          </span>
        </span>
      </div>

      <div className="charts-container">
        {tokenData.length > 0 && (
          <div className="chart-wrapper">
            <h3>Token Usage by Agent</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tokenData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tokens" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {llmCallsData.length > 0 && (
          <div className="chart-wrapper">
            <h3>LLM Calls by Agent</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={llmCallsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="calls" fill="#2ecc71" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {!hasAnalytics && (
          <p className="analytics-hint">
            Per-agent token/call charts appear once the engine exposes turn analytics
            (Phase 3 patch). Confidence and statuses below are live from the state snapshot.
          </p>
        )}
      </div>

      <div className="agent-performance">
        <h3>Agent Performance</h3>
        {agents.length === 0 && (
          <p className="analytics-hint">No workers ran this turn (direct reply).</p>
        )}
        <div className="agent-grid">
          {agents.map((perf) => (
            <div key={perf.agent} className="agent-card">
              <div className="agent-header">
                <span className="agent-name">{perf.agent}</span>
                <span className={`agent-status-chip status-${perf.status}`}>{perf.status}</span>
              </div>
              <div className="agent-stats">
                <div className="agent-stat">
                  <div className="agent-stat-value">
                    {perf.confidence === null ? NA : perf.confidence.toFixed(2)}
                  </div>
                  <div>Confidence</div>
                </div>
                <div className="agent-stat">
                  <div className="agent-stat-value">{fmt(perf.tokenUsage)}</div>
                  <div>Tokens</div>
                </div>
                <div className="agent-stat">
                  <div className="agent-stat-value">{fmt(perf.llmCalls)}</div>
                  <div>LLM Calls</div>
                </div>
                <div className="agent-stat">
                  <div className="agent-stat-value">{fmt(perf.toolCalls)}</div>
                  <div>Tool Calls</div>
                </div>
              </div>
              {perf.notes && <p className="agent-notes">{perf.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
