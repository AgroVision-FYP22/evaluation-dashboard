// src/services/dummyData.ts
import { DashboardData } from '../types/dashboardTypes';

export const dummyDashboardData: DashboardData = {
  response: "Based on the soil analysis, the pH level in your field is 6.2, which is optimal for rice cultivation. The soil has adequate nitrogen levels but could benefit from additional potassium. I recommend applying 50kg/ha of potassium sulfate.",
  citations: [
    {
      title: "Sri Lanka Agricultural Handbook",
      url: "https://example.com/agricultural-handbook",
      page: "Chapter 3, Page 45"
    },
    {
      title: "Soil Fertility Guidelines",
      url: "https://example.com/soil-fertility",
      page: "Section 2.1, Page 12"
    }
  ],
  metrics: {
    responseTime: 2450,
    totalTokens: 856,
    llmCalls: 4,
    toolCalls: 3,
    totalProcessingTime: 2500
  },
  agentPerformance: {
    soil: {
      reliability: 0.92,
      successRate: 0.95,
      confidence: 0.88,
      tokenUsage: 234,
      llmCalls: 2,
      toolCalls: 1
    },
    weather: {
      reliability: 0.87,
      successRate: 0.85,
      confidence: 0.76,
      tokenUsage: 189,
      llmCalls: 1,
      toolCalls: 1
    },
    disease: {
      reliability: 0.78,
      successRate: 0.75,
      confidence: 0.65,
      tokenUsage: 123,
      llmCalls: 1,
      toolCalls: 1
    }
  },
  agentExecution: [
    {
      agent: "orchestrator",
      status: "success",
      startTime: "2026-08-20T10:00:00Z",
      endTime: "2026-08-20T10:00:05Z",
      duration: 5000,
      message: "Planning the analysis workflow"
    },
    {
      agent: "soil",
      status: "success",
      startTime: "2026-08-20T10:00:05Z",
      endTime: "2026-08-20T10:00:15Z",
      duration: 10000,
      message: "Analyzing soil pH and nutrient levels"
    },
    {
      agent: "weather",
      status: "success",
      startTime: "2026-08-20T10:00:05Z",
      endTime: "2026-08-20T10:00:20Z",
      duration: 15000,
      message: "Checking weather conditions for the area"
    },
    {
      agent: "synthesizer",
      status: "success",
      startTime: "2026-08-20T10:00:20Z",
      endTime: "2026-08-20T10:00:25Z",
      duration: 5000,
      message: "Synthesizing the final recommendation"
    },
    {
      agent: "judge",
      status: "success",
      startTime: "2026-08-20T10:00:25Z",
      endTime: "2026-08-20T10:00:30Z",
      duration: 5000,
      message: "Validating the recommendation"
    }
  ],
  stateSnapshot: {
    intent: "soil_query",
    plannerNote: "Planning for soil analysis",
    plan: [
      {
        agent: "soil",
        sub_question: "What is the soil pH and nutrient levels?",
        depends_on: []
      }
    ],
    workers: {
      soil: {
        status: "complete",
        payload: {
          pH: 6.2,
          nitrogen: 85,
          potassium: 42,
          phosphorus: 31
        },
        notes: "Soil analysis completed successfully"
      },
      weather: {
        status: "complete",
        payload: {
          temperature: 28,
          humidity: 75,
          rainfall: 0
        },
        notes: "Weather conditions analyzed"
      }
    },
    synthesis: "The soil pH is optimal for rice cultivation. The soil has adequate nitrogen but needs more potassium.",
    judge_verdict: "approved",
    grounding_verdict: "approved",
    citations: [
      {
        title: "Sri Lanka Agricultural Handbook",
        url: "https://example.com/agricultural-handbook",
        page: "Chapter 3, Page 45"
      }
    ],
    replan_count: 0,
    retry_count: 0
  }
};

export const dummySessions = [
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