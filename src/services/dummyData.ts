// src/services/dummyData.ts
// Demo data matching the real engine's response shape — used only when
// REACT_APP_USE_MOCK=true so the UI can be developed without the engine.

import { DashboardData } from '../types/dashboardTypes';

export const dummyDashboardData: DashboardData = {
  sessionId: 'mock-session',
  response:
    'Based on the soil analysis, the pH level in your field is 6.2, which is optimal for rice cultivation. The soil has adequate nitrogen levels but could benefit from additional potassium. I recommend applying 50kg/ha of potassium sulfate.',
  citations: [
    {
      title: 'DOA Pesticide Recommendations 2019',
      url: 'https://example.com/doa-2019',
      page: '45',
    },
  ],
  metrics: {
    responseTime: 2450,
    totalTokens: null,
    llmCalls: null,
    toolCalls: null,
    totalProcessingTime: null,
  },
  agentPerformance: {
    soil: {
      agent: 'soil',
      status: 'success',
      confidence: 0.88,
      notes: '',
      payload: { ph: 6.2, nitrogen: 85, potassium: 42, phosphorus: 31 },
      tokenUsage: null,
      llmCalls: null,
      toolCalls: null,
    },
  },
  agentExecution: [
    {
      agent: 'orchestrator',
      role: 'planner',
      status: 'success',
      message: 'Routed 1 task(s): soil',
      dependsOn: [],
      duration: null,
    },
    {
      agent: 'soil',
      role: 'worker',
      status: 'success',
      message: 'What is the soil pH and nutrient levels?',
      dependsOn: [],
      duration: null,
    },
    {
      agent: 'synthesizer',
      role: 'synthesizer',
      status: 'success',
      message: 'Drafted the final answer',
      dependsOn: [],
      duration: null,
    },
    {
      agent: 'judge',
      role: 'judge',
      status: 'success',
      message: 'APPROVED: draft is grounded and complete',
      dependsOn: [],
      duration: null,
    },
  ],
  stateSnapshot: {
    intent: 'soil_query',
    planner_note: 'Soil analysis requested',
    plan: [
      {
        agent: 'soil',
        sub_question: 'What is the soil pH and nutrient levels?',
        depends_on: [],
      },
    ],
    workers: {
      soil: {
        status: 'complete',
        payload: {
          ph: 6.2,
          nitrogen: 85,
          potassium: 42,
          phosphorus: 31,
          confidence: 0.88,
        },
        notes: '',
      },
    },
    synthesis:
      'The soil pH is optimal for rice cultivation. The soil has adequate nitrogen but needs more potassium.',
    judge_verdict: 'APPROVED: draft is grounded and complete',
    grounding_verdict: 'pass',
    citations: [
      { source: 'DOA Pesticide Recommendations 2019', page: 45, url: null, subject: null },
    ],
    replan_count: 0,
    retry_count: 0,
  },
};
