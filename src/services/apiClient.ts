// src/services/apiClient.ts
import { DashboardData } from '../types/dashboardTypes';

// This is a placeholder for the real API client
// In a real implementation, this would make actual HTTP requests to the backend
export const apiClient = {
  // Mock chat endpoint - this would be replaced with real API call
  async chat(message: string, sessionId?: string): Promise<DashboardData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would call the actual backend API:
    // const response = await fetch('http://localhost:8100/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message, session_id: sessionId })
    // });
    // return await response.json();
    
    // For now, return dummy data
    return {
      response: `Based on the analysis of your query: "${message}", the system has provided a detailed response. The answer is comprehensive and takes into account multiple factors.`,
      citations: [
        {
          title: "AgroVision Technical Documentation",
          url: "https://example.com/tech-docs",
          page: "Section 4.2"
        },
        {
          title: "Agricultural Best Practices Guide",
          url: "https://example.com/best-practices",
          page: "Chapter 7"
        }
      ],
      metrics: {
        responseTime: Math.floor(Math.random() * 3000) + 1000,
        totalTokens: Math.floor(Math.random() * 1000) + 500,
        llmCalls: Math.floor(Math.random() * 5) + 2,
        toolCalls: Math.floor(Math.random() * 4) + 1,
        totalProcessingTime: Math.floor(Math.random() * 3500) + 1500
      },
      agentPerformance: {
        soil: {
          reliability: Math.random() * 0.2 + 0.8, // 0.8 to 1.0
          successRate: Math.random() * 0.2 + 0.8,
          confidence: Math.random() * 0.2 + 0.8,
          tokenUsage: Math.floor(Math.random() * 300) + 100,
          llmCalls: Math.floor(Math.random() * 2) + 1,
          toolCalls: Math.floor(Math.random() * 2) + 1
        },
        weather: {
          reliability: Math.random() * 0.2 + 0.8,
          successRate: Math.random() * 0.2 + 0.8,
          confidence: Math.random() * 0.2 + 0.8,
          tokenUsage: Math.floor(Math.random() * 250) + 100,
          llmCalls: Math.floor(Math.random() * 2) + 1,
          toolCalls: Math.floor(Math.random() * 2) + 1
        },
        disease: {
          reliability: Math.random() * 0.2 + 0.7,
          successRate: Math.random() * 0.2 + 0.7,
          confidence: Math.random() * 0.2 + 0.7,
          tokenUsage: Math.floor(Math.random() * 200) + 50,
          llmCalls: Math.floor(Math.random() * 2) + 1,
          toolCalls: Math.floor(Math.random() * 2) + 1
        }
      },
      agentExecution: [
        {
          agent: "orchestrator",
          status: "success",
          startTime: new Date(Date.now() - 10000).toISOString(),
          endTime: new Date(Date.now() - 5000).toISOString(),
          duration: 5000,
          message: "Planning the analysis workflow"
        },
        {
          agent: "soil",
          status: "success",
          startTime: new Date(Date.now() - 5000).toISOString(),
          endTime: new Date(Date.now() - 3000).toISOString(),
          duration: 2000,
          message: "Analyzing soil properties"
        },
        {
          agent: "weather",
          status: "success",
          startTime: new Date(Date.now() - 5000).toISOString(),
          endTime: new Date(Date.now() - 2000).toISOString(),
          duration: 3000,
          message: "Checking weather conditions"
        },
        {
          agent: "synthesizer",
          status: "success",
          startTime: new Date(Date.now() - 2000).toISOString(),
          endTime: new Date(Date.now()).toISOString(),
          duration: 2000,
          message: "Synthesizing final response"
        },
        {
          agent: "judge",
          status: "success",
          startTime: new Date(Date.now()).toISOString(),
          endTime: new Date(Date.now() + 1000).toISOString(),
          duration: 1000,
          message: "Validating response quality"
        }
      ],
      stateSnapshot: {
        intent: "multi_query",
        plannerNote: "Complex multi-domain analysis requested",
        plan: [
          {
            agent: "soil",
            sub_question: "What are the soil conditions?",
            depends_on: []
          },
          {
            agent: "weather",
            sub_question: "What are the weather conditions?",
            depends_on: []
          }
        ],
        workers: {
          soil: {
            status: "complete",
            payload: {
              pH: 6.5,
              nitrogen: 80,
              potassium: 45,
              phosphorus: 25
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
        synthesis: "Based on the multi-domain analysis, the soil is suitable for rice cultivation with some adjustments needed.",
        judge_verdict: "approved",
        grounding_verdict: "approved",
        citations: [
          {
            title: "AgroVision Technical Documentation",
            url: "https://example.com/tech-docs",
            page: "Section 4.2"
          }
        ],
        replan_count: 0,
        retry_count: 0
      }
    };
  }
};