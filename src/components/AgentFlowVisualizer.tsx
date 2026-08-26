// src/components/AgentFlowVisualizer.tsx
// Routing-plan timeline built from the engine's real state snapshot: planner
// decision → dispatched workers (with dependencies) → synthesizer → judge.
// Per-node durations render only when the engine exposes node analytics.

import React from 'react';
import './AgentFlowVisualizer.css';
import { AgentExecution } from '../types/dashboardTypes';

interface AgentFlowVisualizerProps {
  agentExecution: AgentExecution[];
}

const ROLE_COLORS: Record<AgentExecution['role'], string> = {
  planner: '#8e44ad',
  worker: '#3498db',
  synthesizer: '#e67e22',
  judge: '#27ae60',
};

function statusDotClass(status: string): string {
  return `flow-dot-${status}`;
}

const AgentFlowVisualizer: React.FC<AgentFlowVisualizerProps> = ({ agentExecution }) => {
  if (!agentExecution.length) return null;

  return (
    <div className="agent-flow-visualizer">
      <h2>Agent Execution Flow</h2>
      <p className="flow-subtitle">
        Reconstructed from this turn's state snapshot — plan order, worker outcomes and the
        judge ruling. Workers listed with a dependency ran after their peers completed.
      </p>
      <div className="flow-timeline">
        {agentExecution.map((step, index) => (
          <div key={index} className="flow-node">
            <span className={`flow-dot ${statusDotClass(step.status)}`} />
            <div
              className="flow-node-content"
              style={{ borderLeftColor: ROLE_COLORS[step.role] }}
            >
              <div className="flow-node-title">
                <h4>{step.agent}</h4>
                <span
                  className="role-badge"
                  style={{ backgroundColor: ROLE_COLORS[step.role] }}
                >
                  {step.role}
                </span>
                <span
                  className={`status ${
                    step.status === 'success'
                      ? 'success'
                      : step.status === 'failed'
                        ? 'failed'
                        : 'pending'
                  }`}
                >
                  {step.status}
                </span>
              </div>
              <p className="flow-message">{step.message}</p>
              {step.dependsOn.length > 0 && (
                <p className="flow-deps">depends on: {step.dependsOn.join(', ')}</p>
              )}
              {step.duration !== null && (
                <div className="duration">Duration: {Math.round(step.duration)} ms</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentFlowVisualizer;
