import React, { useState } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import MetricsPanel from './components/MetricsPanel';
import AgentFlowVisualizer from './components/AgentFlowVisualizer';
import ResponseDetails from './components/ResponseDetails';
import SessionManager from './components/SessionManager';
import { DashboardData } from './types/dashboardTypes';
import { apiClient } from './services/apiClient';

function App() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChatSubmit = async (message: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be:
      // const data = await apiClient.chat(message, currentSession);
      
      // For now, using dummy data with a timeout to simulate API call
      setTimeout(() => {
        // Mock data for demonstration
        const mockData: DashboardData = {
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
        setDashboardData(mockData);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AgroVision Evaluation Dashboard</h1>
      </header>
      
      <div className="app-body">
        <div className="sidebar">
          <SessionManager 
            currentSession={currentSession}
            onSessionSelect={setCurrentSession}
          />
        </div>
        
        <div className="main-content">
          <ChatInterface 
            onChatSubmit={handleChatSubmit}
            isLoading={isLoading}
          />
          
          {dashboardData && (
            <>
              <ResponseDetails 
                response={dashboardData.response}
                citations={dashboardData.citations}
              />
              <MetricsPanel 
                metrics={dashboardData.metrics}
                agentPerformance={dashboardData.agentPerformance}
              />
              <AgentFlowVisualizer 
                agentExecution={dashboardData.agentExecution}
              />
            </>
          )}
        </div>
      </div>
      
      <footer className="app-footer">
        <p>AgroVision Evaluation Dashboard v1.0</p>
      </footer>
    </div>
  );
}

export default App;