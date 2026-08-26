// src/types/dashboardTypes.ts

// ---------------------------------------------------------------------------
// Raw engine contract — mirrors agentic-engine ChatResponse / state_snapshot.
// Kept in engine snake_case; only the adapter touches these.
// ---------------------------------------------------------------------------

/** Engine citation: grounding/models.py Citation. */
export interface EngineCitation {
  source: string;
  page: number | null;
  url: string | null;
  subject: string | null;
}

export interface EnginePlanTask {
  agent: string;
  sub_question: string;
  depends_on: string[];
}

export interface EngineWorkerPost {
  status: string; // 'complete' | 'failed' | ... (TaskStatus values)
  payload: Record<string, unknown> | null;
  notes: string;
}

export interface EngineStateSnapshot {
  intent: string | null;
  planner_note: string | null;
  plan: EnginePlanTask[];
  workers: Record<string, EngineWorkerPost>;
  synthesis: string | null;
  judge_verdict: string | null;
  grounding_verdict: string | null;
  citations: EngineCitation[];
  replan_count: number;
  retry_count: number;
}

/**
 * Per-turn analytics (Phase 3). Exposed additively by the engine; absent when
 * running against an engine without the analytics patch.
 */
export interface EngineAnalytics {
  elapsed_ms: number;
  llm_calls: number;
  tool_calls: number;
  tokens_in: number;
  tokens_out: number;
  nodes: Record<string, { runs: number; duration_ms: number }>;
  per_agent: Record<
    string,
    { llm_calls: number; tool_calls: number; tokens_in: number; tokens_out: number }
  >;
}

export interface EngineChatResponse {
  response: string;
  session_id: string;
  citations: EngineCitation[];
  title: string | null;
  state_snapshot: EngineStateSnapshot | null;
  /** Present only when the engine runs the Phase 3 analytics patch. */
  analytics?: EngineAnalytics;
}

// ---------------------------------------------------------------------------
// Display types — what the dashboard components consume (post-adapter).
// ---------------------------------------------------------------------------

export interface Citation {
  title: string;
  url: string;
  page: string;
}

export interface Metrics {
  /** Client-measured round-trip latency in ms — always available. */
  responseTime: number;
  totalTokens: number | null;
  llmCalls: number | null;
  toolCalls: number | null;
  /** Engine-measured graph runtime in ms; null until analytics is exposed. */
  totalProcessingTime: number | null;
}

export type AgentStatus = 'success' | 'failed' | 'pending';

export interface AgentPerformance {
  agent: string;
  status: AgentStatus;
  /** Worker-computed confidence from its payload; null when not reported. */
  confidence: number | null;
  notes: string;
  payload: Record<string, unknown> | null;
  tokenUsage: number | null;
  llmCalls: number | null;
  toolCalls: number | null;
}

export interface AgentExecution {
  agent: string;
  role: 'planner' | 'worker' | 'synthesizer' | 'judge';
  status: AgentStatus;
  message: string;
  dependsOn: string[];
  /** Per-node duration in ms; null until analytics exposes node timings. */
  duration: number | null;
}

/** The engine's audit record for one turn, passed through unmodified. */
export type StateSnapshot = EngineStateSnapshot;

export interface DashboardData {
  sessionId: string;
  response: string;
  citations: Citation[];
  metrics: Metrics;
  agentPerformance: Record<string, AgentPerformance>;
  agentExecution: AgentExecution[];
  stateSnapshot: StateSnapshot;
}
