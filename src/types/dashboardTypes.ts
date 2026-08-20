// src/types/dashboardTypes.ts

export interface Citation {
  title: string;
  url: string;
  page: string;
}

export interface Metrics {
  responseTime: number;
  totalTokens: number;
  llmCalls: number;
  toolCalls: number;
  totalProcessingTime: number;
}

export interface AgentPerformance {
  reliability: number;
  successRate: number;
  confidence: number;
  tokenUsage: number;
  llmCalls: number;
  toolCalls: number;
}

export interface AgentExecution {
  agent: string;
  status: 'success' | 'failed' | 'pending';
  startTime: string;
  endTime: string;
  duration: number;
  message: string;
}

export interface StateSnapshot {
  intent: string;
  plannerNote: string | null;
  plan: Array<{
    agent: string;
    sub_question: string;
    depends_on: string[];
  }>;
  workers: Record<string, {
    status: string;
    payload: any;
    notes: string;
  }>;
  synthesis: string | null;
  judge_verdict: string | null;
  grounding_verdict: string | null;
  citations: Citation[];
  replan_count: number;
  retry_count: number;
}

export interface DashboardData {
  response: string;
  citations: Citation[];
  metrics: Metrics;
  agentPerformance: Record<string, AgentPerformance>;
  agentExecution: AgentExecution[];
  stateSnapshot: StateSnapshot;
}