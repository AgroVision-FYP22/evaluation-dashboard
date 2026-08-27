// src/services/apiClient.ts
// Talks to the agentic-engine's POST /chat. In dev, CRA's "proxy" field in
// package.json forwards the relative /chat to http://localhost:8100, so no
// CORS is involved and no engine change was needed.

import {
  AgentExecution,
  AgentPerformance,
  AgentStatus,
  Citation,
  DashboardData,
  EngineChatResponse,
  EngineStateSnapshot,
} from '../types/dashboardTypes';
import { dummyDashboardData } from './dummyData';

const CHAT_URL = process.env.REACT_APP_EVAL_API_URL || '/chat';
const IMAGE_UPLOAD_URL = process.env.REACT_APP_EVAL_API_URL
  ? `${process.env.REACT_APP_EVAL_API_URL}/images`
  : '/chat/eval/images';
const SESSION_DELETE_URL = (sessionId: string) => {
  if (process.env.REACT_APP_EVAL_API_URL) {
    return `${process.env.REACT_APP_EVAL_API_URL}/sessions/${encodeURIComponent(sessionId)}`;
  }
  return `/sessions/${encodeURIComponent(sessionId)}`;
};
const REQUEST_TIMEOUT_MS = 5 * 60 * 1000; // a judged multi-worker turn can be slow

/** Set REACT_APP_USE_MOCK=true to develop the UI without the engine running. */
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';
const EVAL_API_KEY = process.env.REACT_APP_EVAL_API_KEY || '';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ChatResult extends DashboardData {
  /** Engine-measured total; client-measured latency is in metrics.responseTime. */
}

function mapStatus(engineStatus: string | undefined): AgentStatus {
  if (engineStatus === 'complete') return 'success';
  if (engineStatus === 'failed') return 'failed';
  return 'pending';
}

function adaptCitations(raw: EngineChatResponse['citations']): Citation[] {
  return raw.map((c, i) => ({
    title: c.source || c.subject || `Source ${i + 1}`,
    url: c.url ?? '',
    page: c.page != null ? String(c.page) : '',
  }));
}

function adaptPerformance(snapshot: EngineStateSnapshot): Record<string, AgentPerformance> {
  const perf: Record<string, AgentPerformance> = {};
  for (const [agent, post] of Object.entries(snapshot.workers ?? {})) {
    const payload = post.payload ?? null;
    const confidence =
      payload && typeof payload === 'object' && 'confidence' in payload
        ? typeof payload.confidence === 'number'
          ? payload.confidence
          : null
        : null;
    perf[agent] = {
      agent,
      status: mapStatus(post.status),
      confidence,
      notes: post.notes ?? '',
      payload,
      tokenUsage: null,
      llmCalls: null,
      toolCalls: null,
    };
  }
  return perf;
}

function adaptExecution(snapshot: EngineStateSnapshot, analytics?: EngineChatResponse['analytics']): AgentExecution[] {
  const steps: AgentExecution[] = [];
  const workers = snapshot.workers ?? {};

  steps.push({
    agent: 'orchestrator',
    role: 'planner',
    status: snapshot.intent ? 'success' : 'pending',
    message:
      snapshot.plan.length > 0
        ? `Routed ${snapshot.plan.length} task(s): ${snapshot.plan.map((t) => t.agent).join(', ')}`
        : snapshot.planner_note
          ? snapshot.planner_note
          : 'Direct reply (no specialists dispatched)',
    dependsOn: [],
    duration: analytics?.nodes?.orchestrate?.duration_ms ?? null,
  });

  for (const task of snapshot.plan) {
    const post = workers[task.agent];
    steps.push({
      agent: task.agent,
      role: 'worker',
      status: post ? mapStatus(post.status) : 'failed',
      message: task.sub_question,
      dependsOn: task.depends_on,
      duration: analytics?.nodes?.[task.agent]?.duration_ms ?? null,
    });
  }

  steps.push({
    agent: 'synthesizer',
    role: 'synthesizer',
    status: snapshot.synthesis ? 'success' : 'pending',
    message: snapshot.synthesis ? 'Drafted the final answer' : 'No draft recorded',
    dependsOn: [],
    duration: analytics?.nodes?.synthesize?.duration_ms ?? null,
  });

  const verdict = snapshot.judge_verdict;
  steps.push({
    agent: 'judge',
    role: 'judge',
    status: verdict ? (verdict.startsWith('APPROVED') ? 'success' : 'pending') : 'pending',
    message: verdict ?? 'Awaiting verdict',
    dependsOn: [],
    duration: analytics?.nodes?.judge?.duration_ms ?? null,
  });

  return steps;
}

function adaptResponse(raw: EngineChatResponse, elapsedMs: number): DashboardData {
  const snapshot = raw.state_snapshot;
  const analytics = raw.analytics;

  const metrics: DashboardData['metrics'] = {
    responseTime: Math.round(elapsedMs),
    totalTokens: analytics ? analytics.tokens_in + analytics.tokens_out : null,
    llmCalls: analytics ? analytics.llm_calls : null,
    toolCalls: analytics ? analytics.tool_calls : null,
    totalProcessingTime: analytics ? analytics.elapsed_ms : null,
    cpuTimeMs: analytics?.cpu_time_ms ?? null,
    ramMb: analytics?.ram_mb ?? null,
  };

  // Fill per-agent token/call counts once analytics exists.
  const perf = snapshot ? adaptPerformance(snapshot) : {};
  if (analytics?.per_agent) {
    for (const [agent, counts] of Object.entries(analytics.per_agent)) {
      perf[agent] = {
        ...(perf[agent] ?? {
          agent,
          status: 'success' as AgentStatus,
          confidence: null,
          notes: '',
          payload: null,
        }),
        tokenUsage: counts.tokens_in + counts.tokens_out,
        llmCalls: counts.llm_calls,
        toolCalls: counts.tool_calls,
      };
    }
  }

  const emptySnapshot: EngineStateSnapshot = {
    intent: null,
    planner_note: null,
    plan: [],
    workers: {},
    synthesis: null,
    judge_verdict: null,
    grounding_verdict: null,
    citations: [],
    replan_count: 0,
    retry_count: 0,
  };

  return {
    sessionId: raw.session_id,
    response: raw.response,
    citations: adaptCitations(raw.citations ?? []),
    metrics,
    agentPerformance: perf,
    agentExecution: snapshot ? adaptExecution(snapshot, analytics) : [],
    stateSnapshot: snapshot ?? emptySnapshot,
  };
}

async function parseError(res: Response): Promise<never> {
  let detail = `${res.status} ${res.statusText}`;
  try {
    const body = await res.json();
    if (body?.detail) detail = String(body.detail);
  } catch {
    // keep status-based message
  }
  if (res.status === 500) {
    throw new ApiError('The engine failed to process this turn (500). Check its terminal output.', 500);
  }
  throw new ApiError(detail, res.status);
}

async function chatViaEngine(
  message: string,
  sessionId?: string,
  imageUrl?: string,
): Promise<DashboardData> {
  const started = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (EVAL_API_KEY) {
      headers['X-Eval-Api-Key'] = EVAL_API_KEY;
    }

    const res = await fetch(CHAT_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        session_id: sessionId ?? undefined,
        image_url: imageUrl?.trim() ? imageUrl.trim() : undefined,
      }),
      signal: controller.signal,
    });
    if (!res.ok) await parseError(res);
    const raw = (await res.json()) as EngineChatResponse;
    return adaptResponse(raw, performance.now() - started);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(`Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s.`);
    }
    throw new ApiError(
      'Cannot reach the agentic engine at /chat. Is it running on port 8100?',
    );
  } finally {
    clearTimeout(timer);
  }
}

export const apiClient = {
  /** Upload an image and return its Cloudinary CDN URL, which is then passed as image_url in chat. */
  async uploadImage(file: File): Promise<string> {
    if (USE_MOCK) {
      // In mock mode return a placeholder so the chat flow still works.
      await new Promise((resolve) => setTimeout(resolve, 500));
      return 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    }
    const form = new FormData();
    form.append('file', file);
    const headers: Record<string, string> = {};
    if (EVAL_API_KEY) {
      headers['X-Eval-Api-Key'] = EVAL_API_KEY;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60_000); // 60 s upload timeout
    try {
      const res = await fetch(IMAGE_UPLOAD_URL, {
        method: 'POST',
        headers,
        body: form,
        signal: controller.signal,
      });
      if (!res.ok) await parseError(res);
      const json = await res.json();
      return json.url as string;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new ApiError('Image upload timed out after 60 s.');
      }
      throw new ApiError('Image upload failed. Is the backend reachable?');
    } finally {
      clearTimeout(timer);
    }
  },

  async chat(
    message: string,
    sessionId?: string,
    imageUrl?: string,
  ): Promise<DashboardData> {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ...dummyDashboardData, sessionId: sessionId ?? 'mock-session' };
    }
    return chatViaEngine(message, sessionId, imageUrl);
  },

  /** Drop a session's conversation memory on the engine (best effort). */
  async deleteSession(sessionId: string): Promise<void> {
    if (USE_MOCK) return;
    try {
      const headers: Record<string, string> = {};
      if (EVAL_API_KEY) {
        headers['X-Eval-Api-Key'] = EVAL_API_KEY;
      }
      const res = await fetch(SESSION_DELETE_URL(sessionId), { method: 'DELETE', headers });
      if (!res.ok && res.status !== 404) await parseError(res);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError('Cannot reach the agentic engine to clear session memory.');
    }
  },
};
