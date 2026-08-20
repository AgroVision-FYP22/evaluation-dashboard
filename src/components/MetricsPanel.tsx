// src/components/MetricsPanel.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './MetricsPanel.css';

interface Metrics {
  responseTime: number;
  totalTokens: number;
  llmCalls: number;
  toolCalls: number;
  totalProcessingTime: number;
}

interface AgentPerformance {
  reliability: number;
  successRate: number;
  confidence: number;
  tokenUsage: number;
  llmCalls: number;
  toolCalls: number;
}

interface MetricsPanelProps {
  metrics: Metrics;
  agentPerformance: Record<string, AgentPerformance>;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics, agentPerformance }) => {
  // Prepare data for charts
  const tokenData = Object.entries(agentPerformance).map(([agent, perf]) => ({
    name: agent.charAt(0).toUpperCase() + agent.slice(1),
    tokens: perf.tokenUsage
  }));

  const llmCallsData = Object.entries(agentPerformance).map(([agent, perf]) => ({
    name: agent.charAt(0).toUpperCase() + agent.slice(1),
    calls: perf.llmCalls
  }));

  const reliabilityData = Object.entries(agentPerformance).map(([agent, perf]) => ({
    name: agent.charAt(0).toUpperCase() + agent.slice(1),
    reliability: perf.reliability * 100
  }));

  // Colors for charts
  const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'];

  return (
    <div className="metrics-panel">
      <h2>Performance Metrics</h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Response Time</h3>
          <div className="metric-value">{metrics.responseTime} ms</div>
        </div>
        
        <div className="metric-card">
          <h3>Total Tokens</h3>
          <div className="metric-value">{metrics.totalTokens}</div>
        </div>
        
        <div className="metric-card">
          <h3>LLM Calls</h3>
          <div className="metric-value">{metrics.llmCalls}</div>
        </div>
        
        <div className="metric-card">
          <h3>Tool Calls</h3>
          <div className="metric-value">{metrics.toolCalls}</div>
        </div>
      </div>
      
      <div className="charts-container">
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
        
        <div className="chart-wrapper">
          <h3>LLM Calls by Agent</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={llmCallsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" fill="#2ecc71" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="agent-performance">
        <h3>Agent Performance</h3>
        <div className="agent-grid">
          {Object.entries(agentPerformance).map(([agent, perf], index) => (
            <div key={agent} className="agent-card">
              <div className="agent-header">
                <span className="agent-name">{agent.charAt(0).toUpperCase() + agent.slice(1)}</span>
                <span className="agent-score">{Math.round(perf.reliability * 100)}%</span>
              </div>
              <div className="agent-stats">
                <div className="agent-stat">
                  <div className="agent-stat-value">{perf.successRate.toFixed(2)}</div>
                  <div>Success Rate</div>
                </div>
                <div className="agent-stat">
                  <div className="agent-stat-value">{perf.confidence.toFixed(2)}</div>
                  <div>Confidence</div>
                </div>
                <div className="agent-stat">
                  <div className="agent-stat-value">{perf.tokenUsage}</div>
                  <div>Tokens</div>
                </div>
                <div className="agent-stat">
                  <div className="agent-stat-value">{perf.llmCalls}</div>
                  <div>LLM Calls</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;