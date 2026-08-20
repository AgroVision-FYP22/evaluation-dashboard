// src/components/AgentFlowVisualizer.tsx
import React from 'react';
import './AgentFlowVisualizer.css';

interface AgentExecution {
  agent: string;
  status: 'success' | 'failed' | 'pending';
  startTime: string;
  endTime: string;
  duration: number;
  message: string;
}

interface AgentFlowVisualizerProps {
  agentExecution: AgentExecution[];
}

const AgentFlowVisualizer: React.FC<AgentFlowVisualizerProps> = ({ agentExecution }) => {
  // Sort by start time
  const sortedExecution = [...agentExecution].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#2ecc71';
      case 'failed': return '#e74c3c';
      case 'pending': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="agent-flow-visualizer">
      <h2>Agent Execution Flow</h2>
      <div className="flow-timeline">
        {sortedExecution.map((execution, index) => (
          <div key={index} className="flow-node">
            <div className="flow-node-content">
              <h4>{execution.agent.charAt(0).toUpperCase() + execution.agent.slice(1)}</h4>
              <p>{execution.message}</p>
              <div className="status" style={{ backgroundColor: getStatusColor(execution.status) }}>
                {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
              </div>
              <div className="duration">
                Duration: {execution.duration} ms
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentFlowVisualizer;