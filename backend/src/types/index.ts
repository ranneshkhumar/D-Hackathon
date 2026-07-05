export interface OrganizationData {
  id: string;
  name: string;
  website: string | null;
  industry: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileData {
  description: string;
  competitors: string[];
  goals: string[];
  challenges: string[];
  [key: string]: any;
}

export interface MetricData {
  metricName: string;
  value: number;
  period: string;
  timestamp: Date;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface AnalysisData {
  analysisType: string;
  results: any;
  createdAt: Date;
}

export interface BusinessContext {
  organization: OrganizationData;
  profile: ProfileData | null;
  metrics: MetricData[];
  previousAnalyses: AnalysisData[];
  chatHistory: ChatMessage[];
  agentMemory: Record<string, AgentResult>;
}

export interface AgentResult {
  agentName: string;
  summary: string;
  issues: string[];
  recommendations: string[];
  confidence: number;
  rawJson: Record<string, any>;
}

export interface Agent {
  analyze(context: BusinessContext, memory?: Record<string, any>): Promise<AgentResult>;
}
