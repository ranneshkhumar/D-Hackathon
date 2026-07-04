export interface Organization {
  id: string;
  name: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface OrgState {
  organizations: Organization[];
  activeOrganizationId: string | null;
}

export interface OrchestratorPayload {
  organization: Organization;
  messages: Message[];
  prompt: string;
}
